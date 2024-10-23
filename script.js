var ANIMATION_LENGTH = 1000;
$(document).ready(function () {
  var $createIdea = $("#createIdea");
  var $openIdea = $("#openIdea");
  $openIdea.click(function () {
    var isShown = $createIdea.css("top") === "0px" ? true : false;
    var newTop = isShown ? "-125vw" : "0px";
    $createIdea.animate({ top: newTop }, ANIMATION_LENGTH);
  });

  $("#createIdea").click(function () {
    this.css("top: 23px");
  });
});

var proglab = document.getElementById("progress");

const getImageData = (e) => {
  file = e.target.files[0];
  fileName = Math.round(Math.random() * 9999) + file.name;
};

function upload() {
  //get your image
  var image = document.getElementById("image").files[0];
  //get your blog text
  var post = document.getElementById("ideaTitle").value;
  var postt = document.getElementById("idea").value;
  var posttt = document.getElementById("ideaOwner").value;
  //get image name
  var imageName = image.name;
  //firebase storage reference
  //it is the path where your image will be stored
  var storageRef = firebase.storage().ref("images/" + imageName);
  //upload image to selected storage reference
  //make sure you pass image here
  var uploadTask = storageRef.put(image);
  //to get the state of image uploading....
  uploadTask.on(
    "state_changed",
    function (snapshot) {
      //get task progress by following code
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      proglab.innerHTML = "%" + progress + "إبداعك قيد التحميل";
    },
    function (error) {
      //handle error here
      console.log(error.message);
    },
    function () {
      //handle successfull upload here..
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //get your image download url here and upload it to databse
        //our path where data is stored ...push is used so that every post have unique id
        firebase
          .database()
          .ref("ideas/")
          .push()
          .set(
            {
              text: post,
              imageURL: downloadURL,
              textt: postt,
              texttt: posttt,
              date: Date.now(),
            },
            function (error) {
              if (error) {
                alert("Error while uploading");
              } else {
                Swal.fire({
                  icon: "success",
                  title: " رحم الله امرؤ شارك عقله عقول الأخرين ",
                  confirmButtonText: '<a href="index.html">شكرًا لك</a>',
                  confirmButtonColor: "#006847",
                });

                //now reset your form
                document.getElementById("post-form").reset();
                getdata();
              }
            }
          );
      });
    }
  );
}

window.onload = function () {
  this.getdata();
};

function getdata() {
  firebase
    .database()
    .ref("ideas/")
    .once("value")
    .then(function (snapshot) {
      var posts_div = document.getElementById("posts");
      posts_div.innerHTML = ""; // Clear previous posts
      var data = snapshot.val();
      console.log(data);

      for (let [key, value] of Object.entries(data)) {
        // Format the date
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(value.date).toLocaleDateString(
          undefined,
          options
        );

        posts_div.innerHTML =
          "<div class='card-body'><h1 class='postTitle'>" +
          value.text +
          "</h1>" +
          "<img src='" +
          value.imageURL +
          "' class='img' onclick='openModal(this.src)'>" +
          "<div class='card-body'><p class='postBody'>" +
          value.textt +
          "</p>" +
          "<div class='card-body'><h6 class='postOwner'>" +
          value.texttt +
          "</h6>" +
          "<div><h6 class='date'>~" +
          date +
          "</h6></div></div><hr class='hr'></div>" +
          posts_div.innerHTML;
      }
    });
}

function delete_post(key) {
  firebase
    .database()
    .ref("ideas/" + key)
    .remove();
  getdata();
}

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  loader.classList.add("loader-hidden");
});

function validateform() {
  validate = true;
  var validate_form = document.querySelectorAll(".main.active .input");
  validate_form.forEach(function (val) {
    val.classList.remove("warning");
    if (val.hasAttribute("require")) {
      if (val.value.length == 0) {
        validate = false;
        val.classList.add("warning");
      }
    }
  });
  return validate;
}
// Function to open the modal and display the image
function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const caption = document.getElementById("caption");

  modal.style.display = "block";
  modalImage.src = imageSrc;
  caption.innerHTML = ""; // I suggest using the image name as the caption
}
// Function to close the modal
function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none";
}

// Close modal on clicking outside of the modal content
window.onclick = function (event) {
  const modal = document.getElementById("imageModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
