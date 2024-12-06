document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Dynamic gallery
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryImages = [
        { src: 'img/interieur.jfif', alt: 'Klassieke herencoupe' },
        { src: 'img/voorbeeld kapsel 2.jpg', alt: 'Stijlvolle baard trim' },
        { src: 'img/voorbeeld kapsel 3.jpg', alt: 'Trendy textured crop' },
        { src: 'img/voorbeeld kapsel 4.jpg', alt: 'Elegante slick back' },
    ];

    galleryImages.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.classList.add('gallery-image');
        galleryContainer.appendChild(imgElement);
    });

    // Mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.id = 'menu-toggle';
    menuToggle.innerHTML = '&#9776;'; // Hamburger icon
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    
    const nav = document.querySelector('nav');
    nav.parentNode.insertBefore(menuToggle, nav);

    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = nav.contains(event.target) || menuToggle.contains(event.target);
        if (!isClickInside && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // VEV integration helper
    function checkVevLoaded() {
        if (window.Vev) {
            window.Vev.init();
        } else {
            setTimeout(checkVevLoaded, 100);
        }
    }
    checkVevLoaded();
});

// Banner and modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Banner text - easily changeable
    const bannerText = "Beste klanten, tussen 30 december en 6 januari ben ik gesloten.";
    
    // Set the banner text
    document.getElementById('bannerText').textContent = bannerText;
    document.getElementById('modalText').textContent = bannerText;

    // Get the banner, modal, and close button
    const banner = document.getElementById('banner');
    const modal = document.getElementById('modal');
    const closeBtn = modal.querySelector('.close');

    // Open modal when banner is clicked
    banner.addEventListener('click', function() {
        modal.style.display = "block";
    });

    // Close modal when close button is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
       // Reviews functionality
       const reviewsContainer = document.getElementById('reviewsContainer');
       const loadMoreButton = document.getElementById('loadMoreReviews');
       let placesService;
       let nextPageToken = '';
   
       function initPlacesService() {
           const map = new google.maps.Map(document.createElement('div'));
           placesService = new google.maps.places.PlacesService(map);
       }
   
       function fetchReviews() {
           const request = {
               placeId: 'ChIJoXxEanMHx0cRt6tQkhwlFq8', // Replace with your actual Place ID
               fields: ['reviews'],
           };
   
           if (nextPageToken) {
               request.pageToken = nextPageToken;
           }
   
           placesService.getDetails(request, (place, status) => {
               if (status === google.maps.places.PlacesServiceStatus.OK) {
                   if (place.reviews) {
                       displayReviews(place.reviews);
                       nextPageToken = place.next_page_token;
                       loadMoreButton.style.display = nextPageToken ? 'block' : 'none';
                   }
               } else {
                   console.error('Error fetching reviews:', status);
               }
           });
       }
   
       function displayReviews(reviews) {
           reviews.forEach(review => {
               const reviewElement = document.createElement('div');
               reviewElement.classList.add('review-card');
               reviewElement.innerHTML = `
                   <h3>${review.author_name}</h3>
                   <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                   <p class="review-text">${review.text}</p>
                   <p class="review-date">${new Date(review.time * 1000).toLocaleDateString()}</p>
               `;
               reviewsContainer.appendChild(reviewElement);
           });
           initializeSlider();
       }
   
       function initializeSlider() {
           const reviewCards = document.querySelectorAll('.review-card');
           let currentIndex = 0;
   
           function showReview(index) {
               reviewCards.forEach((card, i) => {
                   card.style.display = i === index ? 'block' : 'none';
               });
           }
   
           function showNextReview() {
               currentIndex = (currentIndex + 1) % reviewCards.length;
               showReview(currentIndex);
           }
   
           function showPrevReview() {
               currentIndex = (currentIndex - 1 + reviewCards.length) % reviewCards.length;
               showReview(currentIndex);
           }
   
           const nextButton = document.getElementById('nextReview');
           const prevButton = document.getElementById('prevReview');
   
           if (nextButton) {
               nextButton.addEventListener('click', showNextReview);
           }
   
           if (prevButton) {
               prevButton.addEventListener('click', showPrevReview);
           }
   
           showReview(0);
       }
   
       if (loadMoreButton) {
           loadMoreButton.addEventListener('click', fetchReviews);
       }
   
       // Initialize Places service and fetch initial reviews
       initPlacesService();
       fetchReviews();


    // Added lazy loading for images (3a)
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('img[data-src]');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, options);

        images.forEach(img => imageObserver.observe(img));
    };

    lazyLoadImages();

    // Enhanced mobile menu animation (3d)
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    
});