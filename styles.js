import { Dimensions,StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
//const restaurantColor = "#754FAD";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;


function themeColor(){

  return useSelector(state => state.restaurantColor)



}

export const styles = StyleSheet.create(
  {
  containerColor:{
    backgroundColor:'white'
  },
  categories:{
    flex: 1,
    alignItems: "center", 
    backgroundColor:'white',
    padding: 20, 
    margin:10,
    width: windowWidth/3,
    borderRadius: 25,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 2},
    shadowOpacity: 0.19,
    shadowRadius: 5,

  },
  cards:{
    backgroundColor:'#F2F2F2',
    flex:1,
    borderRadius: 25,
    shadowColor: '#171717',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonTitle:{
    fontWeight:'bold',
    fontSize: 14,
    padding: 15,
  },
  button: {
     backgroundColor:"#f6ae2d",
     shadowColor: '#171717',
     shadowOffset: {width: 1, height: 2},
     shadowOpacity: 0.2,
     shadowRadius: 3,
     borderRadius:20,
     margin:10,
     padding: 15,
     
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 50,

  },
  subHeaderText: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  bottomContainer: {

  },
  search: {
    maxHeight: 200,

  },
  menuItemContaner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "white",
    shadowRadius: 2,
    shadowOpacity: 0.4,
    shadowOffset: { 
      width: 0, 
      height: 1 
    },
    elevation: 2,
    justifyContent: 'center',
    margin:10,
    marginHorizontal: 20

  },
  inputContainer: {
    borderRadius: 20,
    marginHorizontal: 45,
    borderWidth: 1,
    borderColor: "white",
    width: '75%',
    backgroundColor: "white",
    shadowRadius: 2,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    marginVertical: 15,
    justifyContent: 'center'

  },
  input: {
    borderBottomWidth: 0,
    marginBottom: -20
  },
  container: {
    flex: 1,
  }, 
  subtitleText: {
    color: "black",
  

  },
  search: {
      maxHeight: 200,

  },
  input: {
      borderWidth: 1,
      padding: 2,
      height: 40,
      width: "100%",
      backgroundColor: 'lightgrey',
      margin: 10
  },
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
  },
  search: {
    maxHeight: 200,

},
inputContainer: {
    borderRadius: 20,
    marginHorizontal: 45,
    borderWidth: 1,
    borderColor: "white",
    width: '100%',
    backgroundColor: "white",
    shadowRadius: 2,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    marginVertical: 15,
    justifyContent: 'center'

},
input: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    padding: 2,
    height: 40,
    margin: 10,
    marginHorizontal: 10,
    borderRadius: 10
    
},
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
},

});