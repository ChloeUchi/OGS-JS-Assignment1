const { rejects } = require('node:assert');
const readline = require('node:readline');
const fs = require('fs');
const Table = require('cli-table');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const { resolve } = require("styled-jsx/css");

async function main() {
    try {
        let value = new Promise((resolve, reject) => {
            rl.question('กรุณาพิมพ์คำสั่ง(ดูรายการสินค้า,ดูประเภทสินค้า,เพิ่มสินค้าในตะกร้า,ลบสินค้าในตะกร้า,แสดงสินค้าในตะกร้า): ', (input) => {
                const [command, product_id] = input.split(' ');
                if (input === "ดูรายการสินค้า") {
                    fs.readFile('data.json', 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading file:', err);
                            return;
                        }

                        try {
                            // Parse JSON data
                            const jsonData = JSON.parse(data);

                            console.table(jsonData, ['name', 'price', 'category', 'quantity', 'product_id', 'balance']);
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    });
                    resolve(input);
                } else if (input === "ดูประเภทสินค้า") {
                    fs.readFile('data.json', 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading file:', err);
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
                    });
                    resolve(input);
                } else if (command === "เพิ่มสินค้าในตะกร้า" && product_id) {
                    fs.readFile('data.json', 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading file:', err);
                            rl.close();
                            return;
                        }

                        try {
                            const jsonData = JSON.parse(data);
                            const item = jsonData.find(item => product_id === product_id);
                            if (item) {
                                // Perform the logic to add item to the cart
                                console.log(`เพิ่มสินค้า ${product_id} สำเร็จ`);
                            } else {
                                console.log('ไม่พบสินค้าสินค้าในตะกร้า:', product_id);
                            }
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }

                        rl.close();
                    });
                } else {
                    reject("Error");
                }
                rl.close();
            });
        });

        // console.log($ { value });
    } catch (e) {
        console.log(e);
    }
}
main()

// const fs = require('fs');

// Read the JSON file
// fs.readFile('data.json', 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading file:', err);
//         return;
//     }

//     try {
//         // Parse JSON data
//         const jsonData = JSON.parse(data);

//         // Display the table using console.table
//         console.table(jsonData, ['(index)', 'name', 'price', 'category', 'quantity', 'product_id', 'balance']);
//     } catch (error) {
//         console.error('Error parsing JSON:', error);
//     }
// });

// const fs = require('fs');
// const Table = require('cli-table');

// // Read the JSON file
// fs.readFile('data.json', 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading file:', err);
//         return;
//     }

//     try {
//         // Parse JSON data
//         const jsonData = JSON.parse(data);

//         // Create a new table
//         const table = new Table({
//             head: ['(index)', 'name', 'price', 'category', 'quantity', 'product_id', 'balance']
//         });
//         // Extract the desired data from the JSON and add it to the table
//         jsonData.forEach(item => {
//             table.push([item.name, item.name, item.price, item.category, item.quantity, item.product_id, item.quantity]);
//         });

//         // Display the table
//         console.log(table.toString());
//     } catch (error) {
//         console.error('Error parsing JSON:', error);
//     }
// });