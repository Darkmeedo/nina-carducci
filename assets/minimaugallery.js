document.addEventListener("DOMContentLoaded", function() {
  // Fonction pour créer la galerie
  function createGallery(options) {
    const gallery = document.querySelector('.gallery');
    const tagsCollection = [];

    // Créer la ligne contenant les images
    const rowWrapper = document.createElement('div');
    rowWrapper.classList.add('gallery-items-row', 'row');
    gallery.appendChild(rowWrapper);

    // Créer la lightbox si nécessaire
    if (options.lightBox) {
      createLightBox(options.lightboxId, options.navigation);
    }

    // Ajouter les images à la galerie
    const galleryItems = gallery.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      responsiveImageItem(item);
      moveItemInRowWrapper(item, rowWrapper);
      wrapItemInColumn(item, options.columns);

      const theTag = item.getAttribute('data-gallery-tag');
      if (options.showTags && theTag && !tagsCollection.includes(theTag)) {
        tagsCollection.push(theTag);
      }
    });

    if (options.showTags) {
      showItemTags(tagsCollection, options.tagsPosition);
    }

    // Afficher la galerie après initialisation
    gallery.style.display = 'block';

    // Ajouter les événements de clic
    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        if (options.lightBox) {
          openLightBox(item, options.lightboxId);
        }
      });
    });
  }

  // Créer la modale Lightbox
  function createLightBox(lightboxId, navigation) {
    const modalId = lightboxId || 'galleryLightbox';
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = modalId;
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    const prevBtn = document.createElement('div');
    prevBtn.classList.add('mg-prev');
    prevBtn.textContent = '<';
    prevBtn.style.cursor = 'pointer';
    prevBtn.style.position = 'absolute';
    prevBtn.style.top = '50%';
    prevBtn.style.left = '-15px';
    prevBtn.style.background = 'white';
    if (navigation) {
      modalBody.appendChild(prevBtn);
    }

    const img = document.createElement('img');
    img.classList.add('lightboxImage', 'img-fluid');
    img.alt = 'Contenu de l\'image affichée dans la modale';
    modalBody.appendChild(img);

    const nextBtn = document.createElement('div');
    nextBtn.classList.add('mg-next');
    nextBtn.textContent = '>';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.position = 'absolute';
    nextBtn.style.top = '50%';
    nextBtn.style.right = '-15px';
    nextBtn.style.background = 'white';
    if (navigation) {
      modalBody.appendChild(nextBtn);
    }

    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);
    document.body.appendChild(modal);

    prevBtn.addEventListener('click', function() {
      prevImage(lightboxId);
    });

    nextBtn.addEventListener('click', function() {
      nextImage(lightboxId);
    });
  }

  // Fonction pour ouvrir la Lightbox
  function openLightBox(element, lightboxId) {
    const modal = document.getElementById(lightboxId);
    const lightboxImage = modal.querySelector('.lightboxImage');
    lightboxImage.src = element.querySelector('img').src;
    modal.style.display = 'block';
  }

  // Fonction pour afficher l'image précédente
  function prevImage(lightboxId) {
    const activeImage = document.querySelector('.lightboxImage');
    let imagesCollection = getImagesCollection();

    let index = imagesCollection.findIndex(img => img.src === activeImage.src);
    index = (index === 0) ? imagesCollection.length - 1 : index - 1;

    activeImage.src = imagesCollection[index].src;
  }

  // Fonction pour afficher l'image suivante
  function nextImage(lightboxId) {
    const activeImage = document.querySelector('.lightboxImage');
    let imagesCollection = getImagesCollection();

    let index = imagesCollection.findIndex(img => img.src === activeImage.src);
    index = (index === imagesCollection.length - 1) ? 0 : index + 1;

    activeImage.src = imagesCollection[index].src;
  }

  // Obtenir toutes les images de la galerie
  function getImagesCollection() {
    return Array.from(document.querySelectorAll('.gallery-item img'));
  }

  // Ajouter les tags au dessus ou en dessous de la galerie
  function showItemTags(tags, position) {
    const tagsBar = document.createElement('ul');
    tagsBar.classList.add('my-4', 'tags-bar', 'nav', 'nav-pills');

    let allTag = `<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>`;
    tags.forEach(tag => {
      allTag += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
    });

    tagsBar.innerHTML = allTag;

    const gallery = document.querySelector('.gallery');
    if (position === 'bottom') {
      gallery.appendChild(tagsBar);
    } else if (position === 'top') {
      gallery.prepend(tagsBar);
    }

    tagsBar.querySelectorAll('.nav-link').forEach(tag => {
      tag.addEventListener('click', function() {
        filterByTag(tag);
      });
    });
  }

  // Filtrer les images par tag
  function filterByTag(tag) {
    const activeTag = tag.getAttribute('data-images-toggle');
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
      const itemTag = item.getAttribute('data-gallery-tag');
      if (activeTag === 'all' || itemTag === activeTag) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Fonction pour rendre les images responsive
  function responsiveImageItem(element) {
    const img = element.querySelector('img');
    if (img) {
      img.classList.add('img-fluid');
    }
  }

  // Déplacer l'élément dans la ligne de la galerie
  function moveItemInRowWrapper(element, rowWrapper) {
    rowWrapper.appendChild(element);
  }

  // Fonction pour envelopper l'élément dans une colonne selon les options
  function wrapItemInColumn(element, columns) {
    let colClass = '';
    if (typeof columns === 'number') {
      colClass = `col-${Math.ceil(12 / columns)}`;
    }
    const column = document.createElement('div');
    column.classList.add('item-column', 'mb-4', colClass);
    column.appendChild(element);
    element.parentNode.replaceChild(column, element);
  }

  // Options de la galerie
  const options = {
    columns: 3,
    lightBox: true,
    lightboxId: 'galleryLightbox',
    showTags: true,
    tagsPosition: 'bottom',
    navigation: true
  };

  // Initialiser la galerie
  createGallery(options);
});
