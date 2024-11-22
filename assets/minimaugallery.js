(function() {
  const mauGallery = function(options) {
    const defaults = {
      columns: 3,
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: "bottom",
      navigation: true
    };
    const config = { ...defaults, ...options };
    const tagsCollection = [];

    // Vérification de base de l'élément
    if (!this || this.length === 0) {
      console.error("Aucun élément de galerie trouvé.");
      return;
    }

    return this.forEach((galleryElement) => {
      createRowWrapper(galleryElement);
      if (config.lightBox) {
        createLightBox(galleryElement, config.lightboxId, config.navigation);
      }
      addListeners(config);

      Array.from(galleryElement.children).forEach((item) => {
        responsiveImageItem(item);
        moveItemInRowWrapper(item);
        wrapItemInColumn(item, config.columns);
        const tag = item.dataset.galleryTag;
        if (config.showTags && tag && !tagsCollection.includes(tag)) {
          tagsCollection.push(tag);
        }
      });

      if (config.showTags) {
        showItemTags(galleryElement, config.tagsPosition, tagsCollection);
      }

      galleryElement.style.display = "block"; // On s'assure que la galerie est visible
    });

    function createRowWrapper(element) {
      if (!element.querySelector('.row')) {
        const rowWrapper = document.createElement('div');
        rowWrapper.classList.add('gallery-items-row', 'row');
        element.appendChild(rowWrapper);
      }
    }

    function wrapItemInColumn(element, columns) {
      const colClass = typeof columns === 'number'
        ? `col-${Math.ceil(12 / columns)}`
        : Object.keys(columns)
            .map(size => `col-${size}-${Math.ceil(12 / columns[size])}`)
            .join(' ');

      const columnWrapper = document.createElement('div');
      columnWrapper.classList.add('item-column', 'mb-4', ...colClass.split(' '));
      columnWrapper.appendChild(element);
      element.parentElement.appendChild(columnWrapper);
    }

    function moveItemInRowWrapper(element) {
      const row = document.querySelector('.gallery-items-row');
      row.appendChild(element);
    }

    function responsiveImageItem(element) {
      if (element.tagName === 'IMG') {
        element.classList.add('img-fluid');
      }
    }

    function addListeners(options) {
      document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
          if (options.lightBox && item.tagName === 'IMG') {
            openLightBox(item, options.lightboxId);
          }
        });
      });

      if (options.navigation) {
        document.querySelector('.gallery').addEventListener('click', (e) => {
          if (e.target.classList.contains('mg-prev')) {
            prevImage(options.lightboxId);
          } else if (e.target.classList.contains('mg-next')) {
            nextImage(options.lightboxId);
          }
        });
      }

      document.querySelectorAll('.gallery').forEach(gallery => {
        gallery.addEventListener('click', (e) => {
          if (e.target.classList.contains('nav-link')) {
            filterByTag(e.target);
          }
        });
      });
    }

    function openLightBox(element, lightboxId) {
      const lightbox = document.getElementById(lightboxId);
      if (!lightbox) {
        console.error("La modale n'a pas pu être trouvée.");
        return;
      }

      const lightboxImage = lightbox.querySelector('.lightboxImage');
      lightboxImage.src = element.src;

      const modal = new bootstrap.Modal(lightbox);
      modal.show();
    }

    function prevImage(lightboxId) {
      const activeImage = document.querySelector(".lightboxImage");
      const allImages = document.querySelectorAll('.gallery-item img');
      const activeIndex = Array.from(allImages).findIndex(img => img.src === activeImage.src);

      const prevImage = allImages[(activeIndex - 1 + allImages.length) % allImages.length];
      activeImage.src = prevImage.src;
    }

    function nextImage(lightboxId) {
      const activeImage = document.querySelector(".lightboxImage");
      const allImages = document.querySelectorAll('.gallery-item img');
      const activeIndex = Array.from(allImages).findIndex(img => img.src === activeImage.src);

      const nextImage = allImages[(activeIndex + 1) % allImages.length];
      activeImage.src = nextImage.src;
    }

    function createLightBox(gallery, lightboxId, navigation) {
      const modalMarkup = `
        <div class="modal fade" id="${lightboxId || 'galleryLightbox'}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body">
                ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>' : ''}
                <img class="lightboxImage img-fluid" alt="Image de la galerie" />
                ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">&gt;</div>' : ''}
              </div>
            </div>
          </div>
        </div>`;
      gallery.insertAdjacentHTML('beforeend', modalMarkup);
    }

    function showItemTags(gallery, position, tags) {
      let tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
      tags.forEach(tag => {
        tagItems += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
      });
      const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
      if (position === 'bottom') {
        gallery.insertAdjacentHTML('beforeend', tagsRow);
      } else if (position === 'top') {
        gallery.insertAdjacentHTML('afterbegin', tagsRow);
      }
    }

    function filterByTag(tagElement) {
      if (tagElement.classList.contains('active-tag')) return;

      document.querySelector('.active-tag').classList.remove('active', 'active-tag');
      tagElement.classList.add('active-tag');

      const tag = tagElement.dataset.imagesToggle;
      document.querySelectorAll('.gallery-item').forEach(item => {
        const column = item.closest('.item-column');
        column.style.display = (tag === 'all' || item.dataset.galleryTag === tag) ? 'block' : 'none';
      });
    }
  };

  // Fonction de test et d'appel
  const galleryElements = document.querySelectorAll('.gallery');
  if (galleryElements.length > 0) {
    galleryElements.forEach(galleryElement => {
      mauGallery.call(galleryElement, { lightboxId: 'myLightbox', navigation: true });
    });
  } else {
    console.error("Aucun élément .gallery trouvé.");
  }
})();
