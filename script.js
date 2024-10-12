document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const tabs = document.querySelectorAll('.tab');
    const selectedItemsContainer = document.getElementById('selected-items-container');
    const totalVolumeElement = document.getElementById('total-volume');
    const selectedCountElement = document.getElementById('selected-count');
    const noItemsMessage = document.getElementById('no-items-message');
    const storageDisplay = document.querySelector('.storage-container');
    const countryToggle = document.getElementById('country-toggle');
    const flagImg = document.getElementById('flag-img');
    const countryName = document.getElementById('country-name');

    let currentCountry = 'sweden'; // Default country

    const itemsData = {
        sweden: {
            kitchen: [
                { name: 'Barstol', volume: 0.07, imgSrc: './public/chair.png' },
                { name: 'Kjøleskap', volume: 0.85, imgSrc: './public/refrigerator.png' },
                { name: 'Microbølgovn', volume: 0.06, imgSrc: './public/microowave.png' },
                { name: 'Oppvaskmaskin', volume: 0.24, imgSrc: './public/Dishwasher.png' }
            ],
            bedroom: [
                { name: 'Enkeltseng', volume: 0.86, imgSrc: './public/singleBed.png' },
                { name: 'Klesskap', volume: 1.44, imgSrc: './public/wardrobe.png' },
                { name: 'Lampe', volume: 0.02, imgSrc: './public/lamp.png' }
            ],
            'living-room': [
                { name: '2-seter Sofa', volume: 1.02, imgSrc: './public/sofa.png' },
                { name: 'TV Unit', volume: 0.38, imgSrc: './public/tv.png' }
            ],
            other: []
        },
        norway: {
            kitchen: [
                { name: 'Barstol', volume: 0.06, imgSrc: './public/chair.png' },
                { name: 'Kjøleskap', volume: 0.75, imgSrc: './public/refrigerator.png' },
                { name: 'Microbølgovn', volume: 0.05, imgSrc: './public/microowave.png' },
                { name: 'Oppvaskmaskin', volume: 0.20, imgSrc: './public/Dishwasher.png' }
            ],
            bedroom: [
                { name: 'Enkeltseng', volume: 0.80, imgSrc: './public/singleBed.png' },
                { name: 'Klesskap', volume: 1.40, imgSrc: './public/wardrobe.png' },
                { name: 'Lampe', volume: 0.01, imgSrc: './public/lamp.png' }
            ],
            'living-room': [
                { name: '2-seter Sofa', volume: 1.00, imgSrc: './public/sofa.png' },
                { name: 'TV Unit', volume: 0.35, imgSrc: './public/tv.png' }
            ],
            other: []
        }
    };

    const storageData = {
        sweden: {
            containers: [
                { maxVolume: 3, name: 'Karlstad XXS', imgSrc: './public/Storage-sweden/karlstad-xxs.png' },
                { maxVolume: 4, name: 'Karlstad XS', imgSrc: './public/Storage-sweden/karlstad-xs.png' },
                { maxVolume: 7, name: 'Karlstad S', imgSrc: './public/Storage-sweden/karlstad-s.png' },
                { maxVolume: 8, name: 'Karlstad M', imgSrc: './public/Storage-sweden/karlstad-m.png' },
                { maxVolume: 10, name: 'Karlstad L', imgSrc: './public/Storage-sweden/karlstad-l.png' },
                { maxVolume: 12, name: 'Karlstad XL', imgSrc: './public/Storage-sweden/karlstad-xl.png' },
                { maxVolume: 15, name: 'Karlstad XXL', imgSrc: './public/Storage-sweden/karlstad-xxl.png' }
            ]
        },
        norway: {
            containers: [
                { maxVolume: 3, name: 'Sandvika XXS', imgSrc: './public/Storage-norway/sandvika-xxs.png' },
                { maxVolume: 4, name: 'Sandvika XS', imgSrc: './public/Storage-norway/sandvika-xs.png' },
                { maxVolume: 7, name: 'Sandvika S', imgSrc: './public/Storage-norway/sandvika-s.png' },
                { maxVolume: 8, name: 'Sandvika M', imgSrc: './public/Storage-norway/sandvika-m.png' },
                { maxVolume: 10, name: 'Sandvika L', imgSrc: './public/Storage-norway/sandvika-l.png' },
                { maxVolume: 12, name: 'Sandvika XL', imgSrc: './public/Storage-norway/sandvika-xl.png' },
                { maxVolume: 15, name: 'Sandvika XXL', imgSrc: './public/Storage-norway/sandvika-xxl.png' }
            ]
        }
    };

    const tabNames = {
        sweden: {
            kitchen: 'Kjøkken',
            bedroom: 'Soverom',
            'living-room': 'Stue',
            other: 'Annet'
        },
        norway: {
            kitchen: 'Kjøkken',
            bedroom: 'Soverom',
            'living-room': 'Stue',
            other: 'Annet'
        }
    };

    const selectedItems = {};

    function loadItems(tabName) {
        itemsContainer.innerHTML = ''; // Clear previous items
        const items = itemsData[currentCountry][tabName];

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.setAttribute('data-name', item.name);
            itemElement.setAttribute('data-volume', item.volume);

            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.imgSrc}" alt="${item.name}">
                </div>
                <div class="item-name">${item.name}</div>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <span class="quantity">${selectedItems[item.name]?.quantity || 0}</span>
                    <button class="increase">+</button>
                </div>
            `;

            itemsContainer.appendChild(itemElement);

            const increaseButton = itemElement.querySelector('.increase');
            const decreaseButton = itemElement.querySelector('.decrease');
            const quantityElement = itemElement.querySelector('.quantity');

            increaseButton.addEventListener('click', () => {
                let quantity = parseInt(quantityElement.textContent);
                quantity++;
                quantityElement.textContent = quantity;
                updateSelectedItems(item, quantity);
            });

            decreaseButton.addEventListener('click', () => {
                let quantity = parseInt(quantityElement.textContent);
                if (quantity > 0) {
                    quantity--;
                    quantityElement.textContent = quantity;
                    updateSelectedItems(item, quantity);
                }
            });
        });
    }
    function displayForm() {
        itemsContainer.innerHTML = `
            <form id="other-items-form" class="other-items-form">
                <label for="item-name">Item Name:</label>
                <input type="text" id="item-name" name="item-name" required>

                <label for="item-volume">Volume (m³):</label>
                <input type="number" id="item-volume" name="item-volume" step="1" required>

                <label for="item-volume">Approximate weight (kilograms):</label>
                <input type="number" id="item-volume" name="item-volume" step="1" required>

                <label for="item-volume">Quantity:</label>
                <input type="number" id="item-volume" name="item-volume" step="1" required>

                <button type="submit">Add</button>
            </form>
        `;
    }
    function updateTabNames() {
        tabs.forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            const spanElement = tab.querySelector('span'); // Get the span inside the tab
            if (spanElement) {
                spanElement.textContent = tabNames[currentCountry][tabName]; // Update only the span's text content
            }
        });
    }
    

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active')); // Remove active class from all tabs
            this.classList.add('active'); // Add active class to the clicked tab
            const tabName = this.getAttribute('data-tab');

            if (tabName === 'other') {
                displayForm(); // Display form if the "other" tab is selected
            } else {
                loadItems(tabName); // Load items for other tabs
            }
        });
    });

    function updateSelectedItems(item, quantity) {
        const itemName = item.name;

        if (quantity > 0) {
            if (selectedItems[itemName]) {
                selectedItems[itemName].quantity = quantity;
            } else {
                selectedItems[itemName] = { ...item, quantity };
            }
        } else {
            delete selectedItems[itemName];
        }

        renderSelectedItems();
        updateTotalVolume();
    }

    function renderSelectedItems() {
        selectedItemsContainer.innerHTML = ''; // Clear previous selected items

        Object.keys(selectedItems).forEach(itemName => {
            const selectedItem = selectedItems[itemName];
            const selectedItemElement = document.createElement('div');
            selectedItemElement.classList.add('selected-item');
            selectedItemElement.dataset.name = itemName;
            selectedItemElement.innerHTML = `
                ${itemName} <span class="quantity">${selectedItem.quantity}</span>
                <button class="remove-button">&times;</button>
            `;
            selectedItemsContainer.appendChild(selectedItemElement);

            selectedItemElement.querySelector('.remove-button').addEventListener('click', () => {
                updateSelectedItems(selectedItem, 0);
            });
        });

        updateSelectedCount();
    }

    function updateTotalVolume() {
        let totalVolume = 0;

        Object.values(selectedItems).forEach(item => {
            totalVolume += item.quantity * item.volume;
        });

        totalVolumeElement.textContent = totalVolume.toFixed(2);

        displayStorageOption(totalVolume);
        toggleNoItemsMessage();
    }

    function displayStorageOption(totalVolume) {
        let storageInfo = '';

        const containers = storageData[currentCountry].containers;
        containers.forEach(container => {
            if (totalVolume <= container.maxVolume) {
                storageInfo = `
                    <div class="storage-option">
                        <p id="storageText">Storage Container Size Needed:</p> 
                        <hr> 
                        <img src="${container.imgSrc}" alt="${container.name}">
                        <p>${container.name}</p>
                    </div>`;
                return;
            }
        });

        if (totalVolume > containers[containers.length - 1].maxVolume) {
            storageInfo = `
                <div class="storage-warning" style="background-color: lightcoral; padding: 10px; border-radius: 5px;">
                    <p>It appears you might need multiple containers. Please chat with us to discuss your move.</p>
                </div>`;
        }

        storageDisplay.innerHTML = storageInfo;
    }

    function updateSelectedCount() {
        const count = Object.keys(selectedItems).length;
        selectedCountElement.textContent = count;
    }

    function toggleNoItemsMessage() {
        const selectedCount = Object.keys(selectedItems).length;
        if (selectedCount > 0) {
            noItemsMessage.classList.remove('hidden');
        } else {
            noItemsMessage.classList.add('hidden');
        }
    }

    countryToggle.addEventListener('change', function() {
        if (this.checked) {
            currentCountry = 'norway';
            flagImg.src = './public/flag/norway.png';
            countryName.textContent = 'Norway';
        } else {
            currentCountry = 'sweden';
            flagImg.src = './public/flag/sweden.png';
            countryName.textContent = 'Sweden';
        }

        // Update the tab names when the country is toggled
        updateTabNames();

        // Reload the items for the selected tab after country change
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            loadItems(activeTab.getAttribute('data-tab'));
        } else {
            loadItems('kitchen'); // Load default tab if no active tab
        }
        updateTotalVolume();
    });

    // Initialize the first tab and set the initial country data
    updateTabNames();
    loadItems('kitchen');
    updateTotalVolume(); // Ensure the total volume is calculated on page load
});
