import OpenAI from "openai";
import { ChatCompletion, ChatCompletionCreateParams } from "openai/resources";
import { Icon, Recipe } from "../../lucia/model";
import mongoose from "mongoose";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export const generateItem = async (item1: string, item2: string) => {
  const recipe = await Recipe.findOne({
    item1,
    item2,
  });

  if (recipe) {
    return recipe.result;
  }

  const chat = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that helps people to craft new things by combining two words into a new word.
          The most important rules that you have to follow with every single answer that you are not allowed to use the words ' + firstWord + " and " + secondWord + ' as part of your answer and that you are only allowed to answer with one thing.
          DO NOT INCLUDE THE WORDS ' + firstWord + " and " + secondWord + ' as part of the answer!!!!! The words ' + firstWord + " and " + secondWord + ' may NOT be part of the answer.
          No sentences, no phrases, no multiple words, no punctuation, no special characters, no numbers, no emojis, no URLs, no code, no commands, no programming
          The answer has to be a noun.
          The order of the both words does not matter, both are equally important.
          The answer has to be related to both words and the context of the words.
          The answer can either be a combination of the words or the role of one word in relation to the other.
          Answers can be things, materials, people, companies, animals, occupations, food, places, objects, emotions, events, concepts, natural phenomena, body parts, vehicles, sports, clothing, furniture, technology, buildings, technology, instruments, beverages, plants, academic subjects and everything else you can think of that is a noun.`,
      },
      {
        role: "user",
        content: `firstWord is ${item1}- and secondWord is ${item2}`,
      },
    ],
    temperature: 1,
  };

  const gptResponse = (await client.chat.completions.create(
    chat as ChatCompletionCreateParams,
  )) as ChatCompletion;

  const name = gptResponse.choices[0].message.content as string;

  const newRecipe = new Recipe({
    _id: new mongoose.Types.ObjectId(),
    item1,
    item2,
    result: name,
  });
  await newRecipe.save();

  return name;
};

export const getIcon = async (name: string) => {
  const dbIcon = await Icon.findOne({
    name,
  });

  if (dbIcon) return dbIcon.icon;

  const chat = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant`,
      },
      {
        role: "user",
        content: `Reply with one emoji for the word ${name}. Use the UTF-8 encoding. Please send just the emoji, no other text.`,
      },
    ],
    temperature: 1,
  };

  const gptResponse = (await client.chat.completions.create(
    chat as ChatCompletionCreateParams,
  )) as ChatCompletion;

  const icon = gptResponse.choices[0].message.content as string;

  const newIcon = new Icon({
    _id: new mongoose.Types.ObjectId(),
    name,
    icon,
  });
  await newIcon.save();

  return icon;
};
