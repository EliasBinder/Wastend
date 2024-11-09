FROM oven/bun:1
LABEL authors="eliasbinder"
COPY . .

ARG WATCH
ENV WATCH=${WATCH}

WORKDIR /home/bun

COPY --from=shared . /home/bun/shared
WORKDIR /home/bun/shared
RUN bun install
RUN bun link
WORKDIR /home/bun/app

RUN bun install

CMD bun run ${WATCH} src/index.ts
