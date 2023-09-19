import AsyncStorage from '@react-native-async-storage/async-storage';

var cache: { [key: string]: any } = {}
var inProgress: { [key: string]: any } = {}

export default class clientStorage {

    static loadCache() {
        return new Promise<void>(done =>
            AsyncStorage.getAllKeys().then(keys => {

                AsyncStorage.multiGet(keys).then(pairArray => {
                    pairArray
                     .forEach(pair => {
                                try{
                                cache[pair[0]] = JSON.parse(pair[1] as any)
                                }
                                catch(e){
                                    console.log("Ignoring key",pair[0])
                                }
                            }
                        )
                    done()

                })

            })
        )
    }
    static clearCache() {
        cache = {}
        inProgress = {}
    }

    static saveItem = async (key: string, value: any) => {
        try {
            cache[key] = value
            return await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // saving error
        }
    }
    static deleteItem = async (key: string) => {
        try {
            cache[key] = undefined
            return await AsyncStorage.removeItem(key)
        } catch (e) {
            // saving error
        }
    }
    static getItem(key: string) {
        return cache[key]
    }
    static getItemAsync = (key: string): Promise<any> => {

        return new Promise((resolve, reject) => {
            if (cache[key]) {
                resolve(cache[key])
                return;
            }
            if (inProgress[key]) {
                inProgress[key].push(resolve)
                return
            }
            inProgress[key] = []
            AsyncStorage.getItem(key).then(x => {
                cache[key] = JSON.parse(x!)
                if (inProgress[key]) {
                    for (let x of inProgress[key])
                        x(cache[key])
                }
                inProgress[key] = null
                resolve(cache[key])
            })
                .catch(() => {
                    if (inProgress[key])
                        for (let x of inProgress[key])
                            x(cache[key])
                    inProgress[key] = null
                    cache[key] = null
                    resolve(null)
                })
        })

    }




}