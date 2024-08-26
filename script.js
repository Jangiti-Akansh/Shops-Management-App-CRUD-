document.addEventListener('DOMContentLoaded', loadShops);

function loadShops() {
    fetch('http://localhost:5000/get/shops')
        .then(response => response.json())
        .then(data => {
            const shopList = document.getElementById('shopdatalist');
            shopList.innerHTML = '';
            data.forEach(shop => {
                const tr = document.createElement('tr');
                tr.dataset.id = shop.id;
                tr.innerHTML = `
                    <td>${shop.name}</td>
                    <td>${shop.location}</td>
                    <td>${shop.rating}</td>
                `;
                tr.addEventListener('click', () => getShopById(shop.id));
                shopList.appendChild(tr);
            });
        })
        .catch(err => console.error('Failed to load shops:', err));
}

function getShops() {
    return {
        name: document.getElementById('name').value.trim(),
        location: document.getElementById('location').value.trim(),
        contact_number: document.getElementById('contact_number').value.trim(),
        opening_hours: document.getElementById('opening_hours').value.trim(),
        owner_name: document.getElementById('owner_name').value.trim(),
        website: document.getElementById('website').value.trim(),
        description: document.getElementById('description').value.trim(),
        rating: parseFloat(document.getElementById('rating').value.trim())
    };
}

function validateShop(shop) {
    if (!shop.name) {
        alert('Shop name is required.');
        return false;
    }
    if (!shop.location) {
        alert('Shop location is required.');
        return false;
    }
    if (isNaN(shop.rating) || shop.rating < 1 || shop.rating > 5) {
        alert('Invalid rating. Please enter a value between 1 and 5.');
        return false;
    }
    return true;
}

function getShopById(id) {
    fetch(`http://localhost:5000/get/shops/${id}`)
        .then(response => response.json())
        .then(shop => {
            document.getElementById('name').value = shop.name;
            document.getElementById('location').value = shop.location;
            document.getElementById('contact_number').value = shop.contact_number;
            document.getElementById('opening_hours').value = shop.opening_hours;
            document.getElementById('owner_name').value = shop.owner_name;
            document.getElementById('website').value = shop.website;
            document.getElementById('description').value = shop.description;
            document.getElementById('rating').value = shop.rating;
        })
        .catch(err => console.error('Failed to load shop details:', err));
}

function addShop() {
    const shop = getShops();
    if (validateShop(shop)) {
        fetch('http://localhost:5000/add/shops', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shop)
        })
            .then(response => response.json())
            .then(() => {
                alert('Shop added successfully!');
                loadShops();
                clearFields();
            })
            .catch(err => console.error('Failed to add shop:', err));
    }
}

function editShop() {
    const shop = getShops();
    if (validateShop(shop)) {
        const selectedShopId = document.querySelector('#shopdatalist tr.selected')?.dataset.id;
        if (selectedShopId) {
            fetch(`http://localhost:5000/edit/shops/${selectedShopId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shop)
            })
                .then(response => response.json())
                .then(() => {
                    alert('Shop updated successfully!');
                    loadShops();
                    clearFields();
                })
                .catch(err => console.error('Failed to update shop:', err));
        } else {
            alert('Please select a shop to edit.');
        }
    }
}

function deleteShop() {
    const selectedShopId = document.querySelector('#shopdatalist tr.selected')?.dataset.id;
    if (selectedShopId) {
        fetch(`http://localhost:5000/delete/shops/${selectedShopId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => {
                alert('Shop deleted successfully!');
                loadShops();
                clearFields();
            })
            .catch(err => console.error('Failed to delete shop:', err));
    } else {
        alert('Please select a shop to delete.');
    }
}

function clearFields() {
    document.getElementById('shopform').reset();
    document.querySelector('#shopdatalist tr.selected')?.classList.remove('selected');
}

document.getElementById('shopdatalist').addEventListener('click', function(event) {
    const tr = event.target.closest('tr');
    if (tr) {
        document.querySelector('#shopdatalist tr.selected')?.classList.remove('selected');
        tr.classList.add('selected');
        getShopById(tr.dataset.id);
    }
});
