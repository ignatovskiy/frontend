export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

export class GildedRose {
   
    items: Array<Item>;
    constructor(items = [] as Array<Item>) {
        this.items = items;
    }

    updateQuality() {
        for (let i = 0; i < this.items.length; i++) {
             this.items[i] = process(this.items[i]); 
         }
        return this.items;
    }
}

function process(item : Item) {
    if (item.name == ("Sulfuras, Hand of Ragnaros")) {
        return item;
    }

    if (item.name == ("Conjured Mana Cake")) {
        item.quality -= 2;
    }

    if (item.name == ("Aged Brie")) {
        item.quality++;
    }

    if (item.name == ("Backstage passes to a TAFKAL80ETC concert")) {
        if (item.sellIn < 0) {
            item.quality = 0;
        }
        else {
            if (item.sellIn < 10) {
                item.quality++;
            }
            if (item.sellIn < 5) {
                item.quality++;
            }
            item.quality++;
        }
    }

    if (item.sellIn < 0) {
        item.quality -= 2;
    } 

    item.sellIn -= 1;

    if (item.quality > 50) {
        item.quality = 50;
    }

    if (item.quality < 0) {
        item.quality = 0;
    }

    return item;
}