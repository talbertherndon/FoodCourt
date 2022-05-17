import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, database, storage } from '../../firebase-config';
import { ref, onValue} from 'firebase/database';
import { getDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref as tef } from 'firebase/storage';
import { Button } from 'react-native-elements'

import Header from './MenuEdit/Header';
import Billing from './../web/Billing';
import QRMenus from './../QRMenus';
import Notifications from './../Restaurants/Notifications';
import Settings from './../Restaurants/Settings';
import Card from '../../Components/Card'

import { setSearchedRestaurantImage, setSearchedRestaurant } from '../../redux/action';
import { QRapiKey } from '../../config.js';
import { styles } from '../../styles'

const MenuEdit = ({ route, navigation }) => {

    const dispatch = useDispatch();

    const { restId } = route.params;

    const [selectedCategory, setSelectedCategory] = useState([]);
    const [restaurant_city, setrestaurant_city] = useState("");
    const [restaurant_state, setrestaurant_state] = useState("");
    const [restaurant_zip, setrestaurant_zip] = useState("");
    const [searchedRestaurant, setRestaurantName] = useState([])
    const [restaurantDesc, setRestaurantDesc] = useState([]);
    const [restaurantId, setRestaurantId] = useState([]);
    const [restaurantImage, setRestaurantImage] = useState([]);
    const [restaurantColor, setRestaurantColor] = useState([]);
    const [restaurantPhone, setRestaurantPhone] = useState([]);
    const [restaurant_address, setRestaurantAddress] = useState("");
    const [restaurant_website, setWebsite] = useState('')
    const [rating, setRating] = useState([]);
    const [menuIndex, setMenuIndex] = useState(0);
    const [setMenu, setSetMenu] = useState('');

    const [loginSession, setLoginSession] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [scanTotal, setScanTotal] = useState("")

    const [menuData, setMenuItem] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loggedin, setloggedin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false)
    const [userPhoto, setUserPhoto] = useState('')
    const [foodItem, setFoodItem] = useState([])
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [filterCatgory, setFilteredCategory] = useState('')
    const [userName, setUserName] = useState('')
    const [menusDesc, setmenusDesc] = useState('')

    const [loadingbio, setLoadingBio] = useState(true);
    const [loadingPic, setLoadingPic] = useState(true);

    const [totalLikes,setTotalLikes] = useState(0);

    const [activeTab, setActiveTab] = useState("home");

    function QRMenuData(id, to, from) {
        console.log("QR DAYA", id)
        console.log("TO", to)
        console.log("FROM", from)

        const data = JSON.stringify({
            "product_id": `${id}`,
            "from": `${from}`,
            "to": `${to}`,
            "product_type": "qr",
            "interval": "1d"
        });

        const config = {
            method: 'post',
            url: 'https://api.beaconstac.com/reporting/2.0/?organization=105513&method=Products.getVisitorDistribution',
            headers: {
                'Authorization': `Token ${QRapiKey}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then(function (response) {
                console.log(response.data);
                setScanTotal(JSON.stringify(response.data.points["0"]["0"]["1"]))
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    function getQrId() {
        const getData = ref(database, 'restaurants/' + restId + '/data/')
        onValue(getData, (snapshot) => {
            const dataqr = snapshot.val();
            if (dataqr !== null) {
                console.log(dataqr.qrid)
                QRMenuData(dataqr.qrid, new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).valueOf(), new Date().valueOf())


            }
        })

    }

    function getFullMenu() {
        const getMenu = ref(database, 'restaurants/' + restId + '/foods/')
        onValue(getMenu, (snapshot) => {

            const data = snapshot.val();
            if (data !== null) {
                console.log(data)
                setFoodItem("")
                setFiltered("")
                setMenuItem("")
                Object.values(data).map((foodData) => {
                    setFoodItem((oldArray) => [...oldArray, foodData]);
                    setMenuItem((oldArray) => [...oldArray, foodData]);
                    setTotalLikes(prevState => prevState + foodData.upvotes)
                })
                //setSetMenu("Breakfast")

            }
        })

    }

    const getCategories = async () => {
        console.log("Getting Category")
        const categories = ref(database, "restaurants/" + restId + "/menus/" + menuIndex + "/categories/")
        onValue(categories, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            if (data !== null) {
                setSelectedCategory("")
                setSelectedCategory(data)
                setFilteredCategory(data)
                getFullMenu();
                getQrId();


            }

        })

        const getRestRatings = ref(database, "restaurants/" + restId + "/restaurantRatings");
        onValue(getRestRatings, (snapshot) => {
            const data = snapshot.val();

            if (data !== null) {
                setRating("")
                Object.values(data).map((ratingData) => {
                    setRating((food) => [...food, ratingData]);

                })
            }
        })
    };

    const getMenus = async () => {
        console.log("Getting Menu")
        const menus = ref(database, "restaurants/" + restId + "/menus")
        onValue(menus, (snapshot) => {
            const data = snapshot.val();
            if (data !== null) {

                console.log(data)
                setSelectedMenus("")
                Object.values(data).map((foodData) => {
                    setSelectedMenus((food) => [...food, foodData]);
                   
                })
                console.log("Menus COLLECTED")
                getCategories();
            }

        })
    };

    const getImage = async () => {
        const imageRef = tef(storage, 'imagesRestaurant/' + restId);
        await getDownloadURL(imageRef).then((url) => {
            dispatch(setSearchedRestaurantImage(url))
            setRestaurantImage(url)
            setLoadingPic(false);
        })
    }

    const getRestaurant = async () => {
        console.log("Getting Restaurant")
        const docRef = doc(db, "restaurants", restId);
        const snapshot = await getDoc(docRef)
        if (snapshot.exists()) {
            setRestaurantId(snapshot.data().restaurant_id)
            setRestaurantPhone(snapshot.data().restaurant_phone)
            setRestaurantAddress(snapshot.data().restaurant_address)
            setRestaurantDesc(snapshot.data().restaurant_desc)
            setRestaurantName(snapshot.data().restaurant_name)
            setRestaurantColor(snapshot.data().restaurant_color)
            setWebsite(snapshot.data().restaurant_website)

            setrestaurant_city(snapshot.data().restaurant_city)
            setrestaurant_state(snapshot.data().restaurant_state)
            setrestaurant_zip(snapshot.data().restaurant_zip)

            dispatch(setSearchedRestaurant(searchedRestaurant, restaurantDesc, restaurant_address, restaurantPhone, restaurantId, restaurantColor))
            getMenus();
            getImage();
            setLoadingBio(false);
        } else {
            console.log("No souch document!")
        }
    }

    useEffect(() => {
        setLoadingBio(true);
        setLoadingPic(true);
        console.log("Mounting")
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setloggedin(true)
                setLoginSession(user.uid)
                setAccessToken(user.accessToken)
                console.log(user)

                const userRef = ref(database, "user/" + user.uid)
                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data !== null) {
                        console.log(data)
                        setIsRestaurant(data.hasRestaurant)
                        setUserPhoto(data.userPhoto)
                        setUserName(data.userName)

                    }
                });
            } else {
                setloggedin(false)
            }
        })
        getRestaurant();
    }, [])

    function onMenuClick(index, clicked, description) {
        setmenusDesc(description)
        // setSetCate(clicked)
        if (setMenu != clicked) {

            //setting categories
            setSelectedCategory(selectedMenus[index].categories)

            // Object.values(foodItem.categories).map((food) => {
            //     setSelectedMenus((food) => [...food, foodData]);
            // })

            //setting food
            setSetMenu(clicked)
            const newData = foodItem.filter((item) => {
                const cateDate = item.menus ?
                    item.menus.toUpperCase() : ''.toUpperCase()
                const cate = clicked.toUpperCase();

                return cateDate.indexOf(cate) > -1;
            });
            setFiltered(newData);
        } else {
            setSetMenu("")
            setMenuItem(foodItem)
            setmenusDesc("")
            setFiltered(null)
            setSelectedCategory(null)
            setmenusDesc("")
        }


    }

    const renderMenus = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => (setMenuItem(foodItem), setFiltered(menuData), onMenuClick(index, item.desc, item.time), setMenuIndex(index))}>
                <View style={[(item.desc !== setMenu) ? styles.shadowProp : styles.null, { paddingHorizontal: (item.desc !== setMenu) ? 20 : 60, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderRadius: 5, marginHorizontal: 5, marginBottom: 5, backgroundColor: (item.desc === setMenu) ? restaurantColor : "white", borderColor: 'white' }]}>
                    <Text style={{ padding: 10, fontWeight: 600, color: (item.desc === setMenu) ? "white" : "black" }}>{item.desc} </Text>
                </View>
            </TouchableOpacity >

        )

    }

    return(
        <View style={{ backgroundColor: "white" }}>
            <Header navigation={navigation} loginSession={loginSession} activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "home" && (
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ backgroundColor: 'white' }}>

                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={selectedMenus}
                            renderItem={renderMenus}
                            initialNumToRender={10}
                        />
                    </View>
                    <View>
                        <FlatList
                            data={filtered}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item, index }) =>
                                <View>
                                    <Card
                                        restaurant={item.restaurant}
                                        ranking={index + item.upvotes}
                                        price={item.price}
                                        food={item.food}
                                        description={item.description}
                                        percent={item.ratingCount > 0 ? (item.eatagain * 100 / item.ratingCount).toFixed(0) : (item.eatagain)}
                                        upvotes={item.upvotes}
                                        overall={item.overall}
                                        upvoteColor={restaurantColor}
                                        category = {item.category}
                                        imageUrl = {item.imageUrl}
                                        navigation={navigation}
                                        restaurantId={restaurantId}
                                        item={item}
                                        searchedRestaurant={searchedRestaurant}
                                    />
                                    {/* <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                        <Button onPress={() => deleteFood(item.food_id)} buttonStyle={{ backgroundColor: '#8A3333' }} buttonTitle={{ fontFamily: 'Bold', fontSize: "20" }} title="Delete" />
                                        <Button onPress={() => navigation.navigate("FoodEdit", { restId: restaurantId, foodId: item.food_id, restName: searchedRestaurant })} buttonStyle={{ backgroundColor: 'orange' }} buttonTitle={{ fontFamily: 'Bold', fontSize: "20" }} title="Edit" />
                                    </View> */}
                                </View>
                            }
                        />
                    </View>
                </View>
            )}
            {activeTab === "snapshot" && <Billing route={route} navigation={navigation}/>}
            {/* {activeTab === "qrmenu" && <QRMenus route={route} navigation={navigation}/>} */}
            {activeTab === "qrmenu" && <Text>There will be QRMenu</Text>}
            {activeTab === "notifications" && <Notifications route={route} navigation={navigation}/>}
            {activeTab === "settings" && <Settings navigation={navigation}/>}
        </View>
    )
}

export default MenuEdit