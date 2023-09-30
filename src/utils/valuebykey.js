export async function valueByKey(key) {
    if (this.data) {
        const item = this.data.find(item => item.value === key);
        if (item) {
            return item;
        }
    }
    const data = await this.load();
    const item = data.find(item => item.value === key);
    if (item) {
        return item;
    } else {
        console.error('Item was not found by key');
    }
}