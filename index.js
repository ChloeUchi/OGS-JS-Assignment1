const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let shoppingCart = {}; // Object to store items in the shopping cart

function main() {
    askCommand();
}

function askCommand() {
    rl.question('กรุณาพิมพ์คำสั่ง(ดูรายการสินค้า,ดูประเภทสินค้า,เพิ่มสินค้าในตะกร้า,ลบสินค้าในตะกร้า,แสดงสินค้าในตะกร้า): ', (input) => {
        const [command, productId] = input.split(' ');

        switch (command) {
            case 'ดูรายการสินค้า':
                viewProducts();
                break;
            case 'ดูประเภทสินค้า':
                viewCategories();
                break;
            case 'เพิ่มสินค้าในตะกร้า':
                if (productId) {
                    addToCart(productId);
                } else {
                    console.log('ไม่พบสินค้าในตะกร้า');
                    askCommand();
                }
                break;
            case 'ลบสินค้าในตะกร้า':
                if (productId) {
                    removeFromCart(productId);
                } else {
                    console.log('ไม่พบสินค้าในตะกร้า');
                    askCommand();
                }
                break;
            case 'แสดงสินค้าในตะกร้า':
                viewCart();
                break;
                // case 'exit':
                //     console.log('Exiting program...');
                //     rl.close();
                //     break;
            default:
                console.log('คำสั่งไม่ถูกต้อง');
                askCommand();
                break;
        }
    });
}

function viewProducts() {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            askCommand();
            return;
        }

        try {
            const products = JSON.parse(data);
            const productsWithBalance = products.map(product => {
                let balance = product.quantity;
                if (shoppingCart[product.product_id]) {
                    balance -= shoppingCart[product.product_id].balance;
                }
                return {...product, balance };
            });
            console.table(productsWithBalance, ['name', 'price', 'category', 'quantity', 'product_id', 'balance']);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

        askCommand();
    });
}



function viewCategories() {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            askCommand();
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const categoryCounts = {};

            jsonData.forEach(item => {
                const category = item.category;
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
            // const duplicates = Object.keys(categoryCounts).filter(key => categoryCounts[key] > 1);
            const duplicateCounts = Object.keys(categoryCounts).map(category => ({ category, amount: categoryCounts[category] }));
            console.table(duplicateCounts);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

        askCommand();
    });
}

function addToCart(productId) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            askCommand();
            return;
        }

        try {
            const products = JSON.parse(data);
            const product = products.find(product => product.product_id === productId);
            if (product) {
                if (!shoppingCart[productId]) {
                    shoppingCart[productId] = {...product, balance: 1 };
                } else {
                    shoppingCart[productId].balance += 1;
                }
                console.log(`เพิ่ม ${product.name} สำเร็จ`);
            } else {
                console.log('ไม่พบสินค้าในตะกร้า');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }

        askCommand();
    });
}

function removeFromCart(productId) {
    if (shoppingCart[productId]) {
        if (shoppingCart[productId].balance > 0) {
            shoppingCart[productId].balance -= 1;
            console.log(`ลบ ${shoppingCart[productId].name} สำเร็จ`);
        } else {
            console.log(`ไม่มี ${shoppingCart[productId].name} ในตะกร้า`);
        }
    } else {
        console.log('ไม่พบสินค้าในตะกร้า');
    }
    askCommand();
}

function viewCart() {
    const cartItems = Object.values(shoppingCart).map(item => ({
        name: item.name,
        price: item.price,
        amount: item.balance,
        all_price: item.price * item.balance
    }));
    cartItems.push({
        name: 'รวม',
        price: '',
        amount: '',
        all_price: cartItems.reduce((value, e) => e.all_price + value, 0)
    })
    console.table(cartItems, ['name', 'price', 'amount', 'all_price']);
    askCommand();
}

main();