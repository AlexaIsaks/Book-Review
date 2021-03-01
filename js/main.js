//Task 18 Compulsory Task 1
//User writes a book review, which is displayed on the webpage
//Book review can be edited and deleted. 
//Book reviews will have storage session

//Mobile: for navigation toggle
let navContainer = document.querySelector(".header__nav-form-container");
let hamburger = document.querySelector(".hamburger");
let bars = [...document.querySelectorAll(".hamburger__bar")];
//Labels for the 3 hamburger bars
let barLabels = ["top", "center", "bottom"];

//Retrieve elements from the popup modal review form 
let popupmodal = document.getElementById("modal-review-form");
let reviewForm = document.getElementById("review-form");
let reviewTitle = document.getElementById("review-title");
let reviewAuthor = document.getElementById("review-author");
let reviewGenre = document.getElementById("review-genre");
let reviewRating = document.getElementById("review-rating");
let reviewReview = document.getElementById("review-review");

//Others
let mainSubheading = document.querySelector(".main-review__subheading");

//All reviews stored in array
let reviewList = [];

//On window load
window.addEventListener("load", () => {
    let reviewFormInput = [...reviewForm.children];

    populateWebpage();

    document.getElementById("write-review").addEventListener("click", displayReviewForm);
    hamburger.addEventListener("click", menuToggle);

    //Prevents review form from submitting when user presses enter.
    //This does not include textarea (to ensure that paragraphs are created in textarea)
    reviewFormInput.forEach(input => {
        if (input.tagName === "INPUT") {
            input.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                }
            });
        }
    });
});

//Checks if the session storage has book reviews. If present, add reviews
//to reviewList array and displays them on the webpage
function populateWebpage() {
    if (sessionStorage.getItem("reviewList") !== null) {
        reviewList = [...JSON.parse(sessionStorage.getItem("reviewList"))];
        reviewList.forEach(review => {
            displayReview(review);
        });
    }

    //Hide "No reviews" subheading
    if (reviewList.length > 0) {
        mainSubheading.style.display = "none";
    }
}

//Displays each book review on webpage
//Each book review will be enclosed in a section and will consist of 
//title, author, genre, rating, text container (containing paragraphs), readmore button,
//container containing edit and delete buttons
function displayReview(book) {
    let reviewContainer = document.querySelector(".main-review__book-container");

    //Create book section
    let section = document.createElement("section");
    section.classList.add("book");
    section.setAttribute("data-id", book.id);

    //Create title
    let title = document.createElement("h2");
    let titleText = document.createTextNode(book.title);
    title.classList.add("book__title");
    title.appendChild(titleText);

    //Create author
    let author = document.createElement("p");
    let authorText = document.createTextNode(book.author);
    author.classList.add("book__author");
    author.appendChild(authorText);

    //Create genre
    let genre = document.createElement("p");
    let genreText = document.createTextNode(book.genre);
    genre.classList.add("book__genre");
    genre.appendChild(genreText);

    //Create rating
    let rating = document.createElement("p");
    let ratingText = document.createTextNode("Rating: " + book.rating + "/10");
    rating.classList.add("book__rating");
    rating.appendChild(ratingText);

    //Create text container and paragraph(s)
    let bookReview = book.review;
    let textContainer = document.createElement("div");
    textContainer.classList.add("book__text-container", "hide-review");

    //Each book review paragraph is presented as an array item of "review" property in the Review object
    //Loop through "review" property array to create a paragraph element for each item
    bookReview.forEach(text => {
        let para = document.createElement("p");
        let paraText = document.createTextNode(text);
        para.classList.add("book__text");
        para.appendChild(paraText);
        textContainer.appendChild(para);
    });

    //Create "read more" button
    let readMoreBtn = document.createElement("button");
    let readMoreBtnText = document.createTextNode("Read more...");

    readMoreBtn.classList.add("button", "button--read");
    readMoreBtn.appendChild(readMoreBtnText);
    readMoreBtn.addEventListener("click", readMoreToggle);

    //Create button container with edit and delete buttons
    let btnContainer = document.createElement("div");
    let editBtn = document.createElement("button");
    let editBtnText = document.createTextNode("Edit");
    let deleteBtn = document.createElement("button");
    let deleteBtnText = document.createTextNode("Delete");

    btnContainer.classList.add("book__buttons-container");
    editBtn.classList.add("button", "button--border", "book__button-edit");
    editBtn.setAttribute("data-id", book.id);
    editBtn.setAttribute("id", "edit-review");
    editBtn.appendChild(editBtnText);
    editBtn.addEventListener("click", editReview);
    deleteBtn.classList.add("button", "button--border");
    deleteBtn.setAttribute("data-id", book.id);
    deleteBtn.setAttribute("id", "delete-review");
    deleteBtn.appendChild(deleteBtnText);
    deleteBtn.addEventListener("click", deleteReview);

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    //Append all children to book section
    section.appendChild(title);
    section.appendChild(author);
    section.appendChild(genre);
    section.appendChild(rating);
    section.appendChild(textContainer);
    section.appendChild(readMoreBtn);
    section.appendChild(btnContainer);

    reviewContainer.appendChild(section);
}

//Displays the popup modal review form
function displayReviewForm() {
    popupmodal.classList.remove("hide-review-form");
    popupmodal.classList.add("display-review-form");

    document.querySelector(".modal__close").addEventListener("click", hideReviewForm);
    document.getElementById("submit-review").addEventListener("click", submitReviewForm);
}

//Hides the popup modal review form
function hideReviewForm() {
    //Reset all input to blank
    reviewTitle.value = "";
    reviewAuthor.value = "";
    reviewGenre.value = "";
    reviewRating.value = "";
    reviewReview.value = "";

    popupmodal.classList.remove("display-review-form");
    popupmodal.classList.add("hide-review-form");
}

//Handles review form submission (initial or edit submission)
//Collects review form information
//Creates a new review object, add to array and update session storage OR
//edits existing book review
function submitReviewForm(event) {

    let reviewFormElement = event.target.parentElement;

    event.preventDefault();

    //Check if review form contains ".edit-review" class
    //Initial book review submission will not contain class
    if (!reviewFormElement.classList.contains("edit-review")) {
        //Create a unique id for each book review
        let reviewId = Math.random() * 100;
        reviewId = reviewId.toFixed(3);

        //"review" property of the Review object will be an array of paragraphs
        //To preserve the paragraph format obtained from the textarea, each paragraph
        //is placed as a separate array item
        let reviewReviewArr = reviewReview.value.split("\n").filter(para => {
            return para !== ""; //Remove white-space
        });

        let book = new Review(reviewId, reviewTitle.value, reviewAuthor.value, reviewGenre.value, reviewRating.value, reviewReviewArr);

        reviewList.push(book);
        sessionStorage.setItem("reviewList", JSON.stringify(reviewList));

        //If there is at least 1 review, hide "No reviews" subheading
        if (reviewList.length === 1) {
            mainSubheading.style.display = "none";
        }

        displayReview(book);

    } else {
        //Review form contains ".edit-review" class and therefore the form is an edit
        //Retrieve id of book review and use it to find the review in reviewList array
        let reviewId = reviewForm.dataset.id;
        let review = reviewList.find(rev => {
            return rev.id === reviewId;
        });

        let reviewReviewArr = reviewReview.value.split("\n").filter(para => {
            return para !== "";
        });

        //Update book review (in reviewList array) with new values/information
        review.title = reviewTitle.value;
        review.author = reviewAuthor.value;
        review.genre = reviewGenre.value;
        review.rating = reviewRating.value;
        review.review = reviewReviewArr;

        sessionStorage.setItem("reviewList", JSON.stringify(reviewList));

        //Update webpage with updated book review information
        //Retrieve all books on webpage and find book using book id
        let bookList = [...document.querySelectorAll(".book")];
        let book = bookList.find(bookItem => {
            return bookItem.dataset.id === reviewId;
        });

        //Retrieve all the subsections of the book  i.e. title, author etc
        //Loop through each subsection and add updated text
        let bookSection = [...book.children];

        bookSection.forEach(section => {
            let sectionClass = section.classList;

            if (sectionClass.contains("book__title")) {

                section.textContent = review.title;

            } else if (sectionClass.contains("book__author")) {

                section.textContent = review.author;

            } else if (sectionClass.contains("book__genre")) {

                section.textContent = review.genre;

            } else if (sectionClass.contains("book__rating")) {

                section.textContent = "Rating: " + review.rating + "/10";

            } else if (sectionClass.contains("book__text-container")) {
                //User may change the amount of paragraphs, therefore reset text-container to ""/blank
                section.textContent = "";
                //Recreate paragraphs from scratch
                let bookReview = review.review;

                bookReview.forEach(text => {
                    let para = document.createElement("p");
                    let paraText = document.createTextNode(text);
                    para.classList.add("book__text");
                    para.appendChild(paraText);
                    section.appendChild(para);
                });
            }
        });

        //Remove ".edit-review" and the book's unique id from review form to indicate that it is not an edit form
        reviewForm.classList.remove("edit-review");
        reviewForm.removeAttribute("data-id");
    }

    hideReviewForm();
}

//Create a Review object
function Review(id, title, author, genre, rating, review) {
        this.id = id,
        this.title = title,
        this.author = author,
        this.genre = genre,
        this.rating = rating,
        this.review = review
}

//Edits an existing book review
function editReview(event) {
    let reviewId = event.target.dataset.id;
    let review = reviewList.find(rev => {
        return rev.id === reviewId;
    });

    //Add book review id to review form to identify which review is being edited
    reviewForm.setAttribute("data-id", review.id);

    //Add ".edit-review" to review form to indicate that this is a book review edit form
    reviewForm.classList.add("edit-review");

    //Set all form inputs with respective book review values
    reviewTitle.value = review.title;
    reviewAuthor.value = review.author;
    reviewGenre.value = review.genre;
    reviewRating.value = review.rating;
    reviewReview.value = review.review.join("\n\n"); //Creates paragraphs

    displayReviewForm(review);
}

//Delete book review
function deleteReview(event) {
    let field = event.target;
    let book = field.parentElement.parentElement;
    let bookId = field.dataset.id;

    //Remove book review from reviewList array using book review id
    let index = reviewList.findIndex(review => {
        return review.id === bookId;
    });
    reviewList.splice(index, 1);

    sessionStorage.setItem("reviewList", JSON.stringify(reviewList));

    //Remove book review from webpage
    book.style.display = "none";

    //If all book reviews are deleted display "No Reviews" heading
    if (reviewList.length < 1) {
        mainSubheading.style.display = "block";
    }
}

//Readmore, readless toggle
//Displays and hides the review
function readMoreToggle(event) {
    let readBtn = event.target;
    let bookReview = readBtn.previousSibling                                //Container containing the review
    let displayReview = bookReview.classList.contains("display-review");

    if (displayReview) {
        bookReview.classList.remove("display-review");
        bookReview.classList.add("hide-review");
        readBtn.firstChild.textContent = "Read more...";

    } else {
        bookReview.classList.remove("hide-review");
        bookReview.classList.add("display-review");
        readBtn.firstChild.textContent = "Read less...";
    }
}


//Navigation Toggle
//Open and close mobile menu/hamburger/navigation

//Function to open and close the menu on mobile
function menuToggle() {
    if (navContainer.classList.contains("is-open")) {
        closeMenu();
    } else {
        openMenu();
    }
}

//Open the menu; convert hamburger menu to a cross
function openMenu() {
    navContainer.classList.add("is-open");

    //Add appropriate classlist to each hamburger bar to perform animation
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add("hamburger__bar--" + barLabels[i]);
    }
}

//Close the menu; convert cross to hamburger icon
function closeMenu() {
    navContainer.classList.remove("is-open");

    //Remove appropriate classlist to each hamburger bar to perform animation
    for (let i = 0; i < bars.length; i++) {
        bars[i].classList.remove("hamburger__bar--" + barLabels[i]);
    }
}