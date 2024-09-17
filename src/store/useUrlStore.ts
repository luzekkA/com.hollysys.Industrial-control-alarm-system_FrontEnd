import { defineStore } from 'pinia'
import { Names } from './store-name'
export interface url {
    path: string
}
export const useUrlStore = defineStore(Names.URLSTORE, {
    state: () => {
        return {
            UrlList: [] as Array<url>,
            //  routesList: [] as any,
        }
    },
    actions: {
        loadUrls (){
            const savedUrls = localStorage.getItem('urls');
            if (savedUrls) {
                this.UrlList = JSON.parse(savedUrls);
            }
        },
        saveUrls(){
            localStorage.setItem('urls', JSON.stringify(this.UrlList));
        },
        addUrl(url: url) {
            this.UrlList.push(url);
            this.saveUrls();
        },
        removeUrl(index: number) {
            this.UrlList.splice(index, 1);
            this.saveUrls();
        }
    }
})