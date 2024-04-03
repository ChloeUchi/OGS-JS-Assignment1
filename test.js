const fs = require('fs');
const readline = require('readline');
const Table = require('cli-table');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function main() {
    rl.question('กรุณาพิมพ์คำสั่ง(ดูรายการสินค้า,ดูประเภทสินค้า,เพิ่มสินค้าในตะกร้า,ลบสินค้าในตะกร้า,แสดงสินค้าในตะกร้า): ', (input) => {
        const [command, product_id] = input.split(' ');

        if (command === "เพิ่มสินค้าในตะกร้า" && product_id) {
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
                        console.log(`Added item with ID ${product_id} to the cart.`);
                    } else {
                        console.log('ไม่พบรหัสสินค้า:', product_id);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }

                rl.close();
            });
        } else {
            console.log('คำสั่งไม่ถูกต้อง');
            rl.close();
        }
    });
}

main();