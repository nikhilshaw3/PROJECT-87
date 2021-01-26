import React from 'react';
import{View,Text,TextInput,KeyboardAvoidingView,StyleSheet,TouchableOpacity,Alert} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader.js'

export default class HomeScreen extends React.Component{
constructor(){
super();
this.state={
userId : firebase.auth().currentUser.email,
item:"",
description:"",
}
}

createUniqueId(){
return Math.random().toString(36).substring(7);
}

getExchangeRequest=()=>{
var exchangeRequest = db.collection('exchange_books')
.where('user_id',"==","this.state.userId").get()
.then((snapshot)=>{
snapshot.forEach((doc)=>{
if(doc.data().item_status !== "received"){
this.setState({
exchangeId: doc.data().exchangeId,
requestedItemName: doc.data().item_name,
itemStatus: doc.data().item_status,
docId: doc.id
})
}
})
})
}

sendNotification=()=>{
db.collection('users').where("emailId","==",this.state.userId).get()
.then((snapshot)=>{
snapshot.forEach((doc)=>{
var name = doc.data().first_name,
 lastName = doc.data().last_name

db.collection('allNotifications').where("request_id","==",this.state.requestId).get()
.then((snapshot)=>{
snapshot.forEach((doc)=>{
var donorId = doc.data().donor_Id,
itemName = doc.data().item_name
       
db.collection('allNotifications').add({
"targeted_user_id": donorId,
"message":name+""+lastName +"received the book" +itemName, 
"item_Name": itemName
      
})})})})})}

getIsExchangeRequestActive=()=>{

  db.collection('users')
.where('email_id',"==",this.state.userId)
.onSnapshot(querySnapshot =>{
querySnapshot.forEach((doc)=>{

this.setState({
IsExchangeRequestActive: doc.data().IsExchangeRequestActive,
userDocId: docId
})})})}


updateExchangeRequestStatus=()=>{
db.collection('requests').doc(this.state.docId).update({
Item_status: 'recieved'
})
        
db.collection('users').where("email_id","==" , this.state,userId).get()
.then((snapshot)=>{
snapshot.forEach((doc)=>{

db.collection('users').doc(doc.id).update({
isExchangeRequestActive: false

})})})}

addItem = (item,description)=>{
var userId = this.state.userId
var randomRequestId = this.createUniqueId()

db.collection("requests").add({
item : this.state.item,
description : this.state.description 
});

return(alert("ITEM READY TO EXCHANGE",
'',
[

  {text: 'OK' , onPress: ()=>{
this.props.navigation.navigate('HomeScreen')
}}]))}

render(){

if(this.state.IsExchangeRequestActive == true){
return(
<View style={{flex: 1,justifyContent: 'center'}}>
<View style={{borderColor: 'orange',borderWidth:2,justifyContent: 'center',alignContent: 'center',alignItems: 'center',padding: 10,margin: 10}}>

<Text>Item Name</Text>
<Text>{this.state.requestedItemName}</Text>

</View>
<View>

<Text>Item Status</Text>
<Text>{this.state.itemStatus}</Text>

</View>

<TouchableOpacity style={{borderColor: 'orange',borderWidth:2,justifyContent: 'center',alignContent: 'center',alignItems: 'center',padding: 10,margin: 10}}

onPress={()=>{
this.sendNotification()
this.updateExchangeRequestStatus();
this.receivedItem(this.state.requestedItemName)

}}>
      
<Text>I received the item</Text>

</TouchableOpacity>
</View>
     
)
}else{
return(

<View style={{flex:1}}>
<MyHeader title="ADD AN ITEM"/>
<KeyboardAvoidingView style={styles.keyBoardStyle} behavior="padding">            

<TextInput style={styles.formTextInput}
placeholder="Item name"
onChangeText={(text)=>{
this.setState({
item : text
})}}
value={this.state.item}
/>

<TextInput style={[styles.formTextInput,{height:300}]}
placeholder="Item description"
numberOfLines={8}
multiline
onChangeText={(text)=>{
this.setState({
description : text
})}}
value={this.state.description}
/>

<TouchableOpacity style={styles.button}

onPress={()=>{
this.addItem();
this.setState({
item : "",
description : "",
}

)}}
>

<Text>Add Item</Text>

</TouchableOpacity>

</KeyboardAvoidingView>

</View>
)}}}

const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"50%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"50%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )
  