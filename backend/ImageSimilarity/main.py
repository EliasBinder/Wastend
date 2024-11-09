import datetime
import cv2
from image_similarity_measures.evaluate import evaluation
from image_similarity_measures.quality_metrics import rmse, fsim, ssim
from flask import Flask, request, jsonify

app = Flask(__name__)

def compute_similarity(trash, no_trash, treshold=0.7):
    res = 0
    inverse_t = 1-treshold
    res += (rmse(trash, no_trash) < inverse_t)
    res += (ssim(trash, no_trash) > treshold)
    if res > 1:
        return True
    if res < 1:
        return False
    return (fsim(trash, no_trash) < inverse_t)

def compute_similarity_test(trash, no_trash, metrcis=["rmse", "psnr"]):
    return evaluation(org_img_path=trash, pred_img_path=no_trash, metrics=metrcis)


def test():
    #print(compute_similarity('img1.jpg', 'img2.jpg'))
    #call the function with the path of the two images for each of the following metrics ["fsim", "issm", "psnr", "rmse","sam", "sre", "ssim", "uiq"]

    #structure and feature similarity index [0,1]
    #get current time
    time = datetime.datetime.now()
    print(compute_similarity_test('img1.jpg', 'img2.jpg', ["fsim"]))
    time2 = datetime.datetime.now()
    print("computed in: " + str(time2-time))

    #dropped lak of explainability
    #print(compute_similarity('img1.jpg', 'img2.jpg', ["psnr"]))
    #Root Mean Square Error [0, +inf]
    time = datetime.datetime.now()
    print(compute_similarity_test('img1.jpg', 'img2.jpg', ["rmse"]))
    time2 = datetime.datetime.now()
    print("computed in: " + str(time2-time))
    #SRE is efficient for images with high contrast
    #dropped lak of explainability
    #print(compute_similarity('img1.jpg', 'img2.jpg', ["sre"]))
    #SSIM addresses the limitations of the compression/data loss issues
    time = datetime.datetime.now()
    print(compute_similarity_test('img1.jpg', 'img2.jpg', ["ssim"]))
    time2 = datetime.datetime.now()
    print("computed in: " + str(time2-time))

# Press the green button in the gutter to run the script.
#if __name__ == '__main__':
#    t_img = cv2.imread('img1.jpg')
#    nt_img = cv2.imread('img2.jpg')
#    print(compute_similarity(t_img, nt_img))

@app.route('/')
def help():
    return jsonify("POST /img with two images: trash and no_trash")

@app.route('/img', methods=['POST'])
def api():
    if request.method == 'POST':
        t_img = request.files.get('trash')#cv2.imread(request.files['trash'])
        nt_img = request.files.get('no_trash')#cv2.imread(request.files['no_trash'])

        #store files in temp folder
        t_img.save('trash.jpg')
        nt_img.save('no_trash.jpg')
        t_img = cv2.imread('trash.jpg')
        nt_img = cv2.imread('no_trash.jpg')

        return jsonify({'result': str(compute_similarity(t_img, nt_img))})
