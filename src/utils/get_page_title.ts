import {settings} from '../settings'
const title = settings.title
export default function getPageTitle(pageTitle:string){
    if (pageTitle) {
        return `${pageTitle} - ${title}`
      }
      return `${title}`
}