class MauGallery {
    constructor(selector, options = {}) {
        this.gallery = document.querySelector(selector);
        this.options = Object.assign({
            columns: 3,
            lightBox: true,
            lightboxId: null,
            showTags: true,
            tagsPosition: "bottom",
            navigation: true
        }, options);
        this.tagsCollection = [];
        this.init();
    }

    init() {
        this.createRowWrapper();
        if (this.options.lightBox) {
            this.createLightBox();
        }
        this.addListeners();
        const galleryItems = this.gallery.querySelectorAll(".gallery-item");
        galleryItems.forEach((item) => {
            this.responsiveImageItem(item);
            this.moveItemInRowWrapper(item);
            this.wrapItemInColumn(item);
            const theTag = item.dataset.galleryTag;
            if (this.options.showTags && theTag && !this.tagsCollection.includes(theTag)) {
                this.tagsCollection.push(theTag);
            }
        });
        if (this.options.showTags) {
            this.showItemTags();
        }
        this.gallery.style.display = "block";
        this.gallery.style.opacity = 0;
        setTimeout(() => {
            this.gallery.style.opacity = 1;
        }, 500);
    }

    createRowWrapper() {
        if (!this.gallery.querySelector(".gallery-items-row")) {
            const row = document.createElement("div");
            row.classList.add("gallery-items-row", "row");
            this.gallery.appendChild(row);
        }
    }

    wrapItemInColumn(item) {
        const columns = this.options.columns;
        const column = document.createElement("div");
        column.classList.add("item-column", "mb-4");
        if (typeof columns === "number") {
            column.classList.add(`col-${Math.ceil(12 / columns)}`);
        } else if (typeof columns === "object") {
            if (columns.xs) column.classList.add(`col-${Math.ceil(12 / columns.xs)}`);
            if (columns.sm) column.classList.add(`col-sm-${Math.ceil(12 / columns.sm)}`);
            if (columns.md) column.classList.add(`col-md-${Math.ceil(12 / columns.md)}`);
            if (columns.lg) column.classList.add(`col-lg-${Math.ceil(12 / columns.lg)}`);
            if (columns.xl) column.classList.add(`col-xl-${Math.ceil(12 / columns.xl)}`);
        } else {
            console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
        }
        column.appendChild(item);
        this.gallery.querySelector(".gallery-items-row").appendChild(column);
    }

    moveItemInRowWrapper(item) {
        this.gallery.querySelector(".gallery-items-row").appendChild(item);
    }

    responsiveImageItem(item) {
        if (item.tagName === "IMG") {
            item.classList.add("img-fluid");
        }
    }

    createLightBox() {
        const lightboxId = this.options.lightboxId || "galleryLightbox";
        const modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.id = lightboxId;
        modal.tabIndex = -1;
        modal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        ${this.options.navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:10px;z-index:10;">&lt;</div>' : ''}
                        <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                        ${this.options.navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:10px;z-index:10;">&gt;</div>' : ''}
                    </div>
                </div>
            </div>`;
        this.gallery.appendChild(modal);
        this.lightbox = modal;
    }

    addListeners() {
        const galleryItems = this.gallery.querySelectorAll(".gallery-item");
        galleryItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                if (this.options.lightBox && e.target.tagName === "IMG") {
                    this.openLightBox(e.target);
                }
            });
        });
        if (this.options.navigation) {
            this.gallery.addEventListener("click", (e) => {
                if (e.target.classList.contains("mg-prev")) {
                    this.prevImage();
                } else if (e.target.classList.contains("mg-next")) {
                    this.nextImage();
                }
            });
        }
    }

    openLightBox(image) {
        const lightboxImage = this.lightbox.querySelector(".lightboxImage");
        lightboxImage.src = image.src;
        const modal = new bootstrap.Modal(this.lightbox);
        modal.show();
    }

    prevImage() {
        const currentSrc = new URL(this.lightbox.querySelector(".lightboxImage").src, document.baseURI).href;
        const images = Array.from(this.gallery.querySelectorAll(".gallery-item img"))
            .map(img => new URL(img.src, document.baseURI).href);
        const currentIndex = images.findIndex(src => src === currentSrc);
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        this.lightbox.querySelector(".lightboxImage").src = images[prevIndex];
    }

    nextImage() {
        const currentSrc = new URL(this.lightbox.querySelector(".lightboxImage").src, document.baseURI).href;
        const images = Array.from(this.gallery.querySelectorAll(".gallery-item img"))
            .map(img => new URL(img.src, document.baseURI).href);
        const currentIndex = images.findIndex(src => src === currentSrc);
        const nextIndex = (currentIndex + 1) % images.length;
        this.lightbox.querySelector(".lightboxImage").src = images[nextIndex];
    }

    showItemTags() {
        const tagsBar = document.createElement("ul");
        tagsBar.classList.add("my-4", "tags-bar", "nav", "nav-pills");
        const allTag = document.createElement("li");
        allTag.classList.add("nav-item");
        allTag.innerHTML = `<span class="nav-link active active-tag" data-images-toggle="all">Tous</span>`;
        tagsBar.appendChild(allTag);
        this.tagsCollection.forEach(tag => {
            const tagItem = document.createElement("li");
            tagItem.classList.add("nav-item");
            tagItem.innerHTML = `<span class="nav-link" data-images-toggle="${tag}">${tag}</span>`;
            tagsBar.appendChild(tagItem);
        });
        if (this.options.tagsPosition === "bottom") {
            this.gallery.appendChild(tagsBar);
        } else if (this.options.tagsPosition === "top") {
            this.gallery.insertBefore(tagsBar, this.gallery.firstChild);
        } else {
            console.error(`Unknown tags position: ${this.options.tagsPosition}`);
        }
        tagsBar.addEventListener("click", (e) => {
            if (e.target.classList.contains("nav-link")) {
                this.filterByTag(e.target);
            }
        });
    }

    filterByTag(tagElement) {
        const activeTag = this.gallery.querySelector(".active-tag");
        if (activeTag) {
            activeTag.classList.remove("active", "active-tag");
        }
        tagElement.classList.add("active-tag");
        const tag = tagElement.dataset.imagesToggle;
        const items = this.gallery.querySelectorAll(".gallery-item");
        items.forEach(item => {
            const column = item.closest(".item-column");
            if (tag === "all" || item.dataset.galleryTag === tag) {
                column.style.display = "block";
            } else {
                column.style.display = "none";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MauGallery("#gallery", {
        columns: 3,
        lightBox: true,
        showTags: true,
        tagsPosition: "top"
    });
});
