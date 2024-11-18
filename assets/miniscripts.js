$(document).ready(function(){$('.gallery').mauGallery({columns:{xs:1,sm:2,md:3,lg:3,xl:3},lightBox:!0,lightboxId:'myAwesomeLightbox',showTags:!0,tagsPosition:'top'})})

document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector('#carouselExampleIndicators');
    const carouselImages = carousel.querySelectorAll('.carousel-item img');

    carousel.addEventListener('slide.bs.carousel', function(event) {
        const nextSlide = event.relatedTarget;
        const img = nextSlide.querySelector('img');
        
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
});
