import { Client, Account,TablesDB, ID, Query} from "appwrite";
const client = new Client();

client
.setEndpoint('https://fra.cloud.appwrite.io/v1')
.setProject('6ace1448000d79061a60');

//services
export const account =new Account(client);
export const tablesDB = new TablesDB(client);
export{ID ,Query};

export const TablesDB_ID ='6ace20630000a62af099'

export const COLLECTIONS = {
    USERS: '6ace30f500083384b6c1',
    POSTS: '6ace3126000870d3fb09',
    COMENTS:'6ace31660017e52223e2'

}