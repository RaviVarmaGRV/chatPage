var clientSocket=io();

var oneOnOne=document.getElementById('oneOnOne');
var group=document.getElementById('group');
var home=document.querySelector('.home');
var toPerson=document.getElementById('roomInput');//
var popUp=document.getElementById('forPopUp');
var errMsg=document.getElementById('errorMsg');
var label=document.getElementById('label');
var chat=document.getElementById('chat');
var msg=document.querySelector('.textArea');
var wholeMsgBox=document.getElementById('messages');
var back=document.getElementById('backIcon');

var optionSelected;

var usrName=prompt('Enter a user name');
// var usrName="name";

clientSocket.emit('addMe',usrName);

oneOnOne.addEventListener('click',()=>{
    // console.log(roomName);
    optionSelected="oneToOne";

    console.log('create');
    popUp.style.display='flex';
    label.textContent='Enter user id';
    toPerson.focus();

})


group.addEventListener('click',()=>{
    optionSelected='group';
    console.log(toPerson);
    console.log('join');

    popUp.style.display='flex';
    label.textContent='Enter group name';

    // joiningButton.textContent='JOIN';
    toPerson.focus();

})

cancel.addEventListener('click',()=>{
    popUp.style.display='none';
    errMsg.style.color="hsl(214, 47%, 23%)";
})

chat.addEventListener('click',()=>{
    console.log('yes');

    if (optionSelected!='group') {
        clientSocket.emit('check',document.getElementById('roomInput').value,(boolean)=>{
            if (boolean) {
                popUp.style.display='none';
                home.style.display='none';
                toPerson=toPerson.value;
                document.getElementById('userName').textContent=toPerson;
                document.getElementById('privateMsg').style.display='block';
            }
            else{
                console.log('ok');
                
                errMsg.textContent="This user is unavailable right now!";
                errMsg.style.color="red";
            }
        })
    }
    else{
        clientSocket.emit('joinRoom',document.getElementById('roomInput').value);
        popUp.style.display='none';
                home.style.display='none';
                toPerson=toPerson.value;
                document.getElementById('userName').textContent=toPerson;
                document.getElementById('privateMsg').style.display='block';

    }

    
})

back.addEventListener('click',()=>{
    document.getElementById('privateMsg').style.display='none';
    home.style.display='flex';
})

send.addEventListener('click',()=>{
    sendMsgs(msg.value,"myMsg","no");
    // if (optionSelected!='group') {
        clientSocket.emit('addMessage',msg.value,usrName,toPerson,optionSelected);
        
    
    console.log('user : ',usrName);
    console.log('user : ',toPerson);

    
    msg.value=null;
});

msg.addEventListener('keydown',function(event) {
    if (event.key=='Enter') {
        sendMsgs(msg.value,"myMsg","no");
        clientSocket.emit('addMessage',msg.value,usrName,toPerson,optionSelected);
        console.log('emitted');
        console.log('user : ',usrName);
        console.log('user : ',toPerson);
        

        // clientSocket.emit('addMessage',msg.value,commentedMesgBox.id,usrName);        
        msg.value=null;
    }
})

clientSocket.on('msgAdd',(msg,userName,to)=>{
    console.log('received');
    console.log(to);
    console.log(usrName);
    
    if (optionSelected!='group') {
        if(to==usrName){
            sendMsgs(msg,'other');
    
        }  
    }
    else if(optionSelected=='group' && userName!=usrName){
        sendMsgs(msg,'other',userName);
    }
    
})
clientSocket.on('otherConnection',(msg)=>{
    console.log(msg);
    
})


function sendMsgs(mesg,sender,userName) {
    var fullMsgwithTime=document.createElement('div');
    if (sender=="myMsg") {
        fullMsgwithTime.classList.add('mesWithTime');
    }
    else{
        fullMsgwithTime.classList.add('msgReceived');
    }

    var msgBox=document.createElement('div');
    msgBox.classList.add('myMessage');

    var msg=document.createElement('p');
    msg.textContent=mesg;

    var time=document.createElement('p');
    // time.classList.add('time');

    var currentdate=new Date();

    time.innerText=currentdate.getHours()+":"+currentdate.getMinutes();

    if (optionSelected=='group' && userName!='no') {
        var pTag= document.createElement('p');
        pTag.classList.add('name');
        pTag.innerHTML='<em>'+userName+'</em>\n';
        msgBox.appendChild(pTag);
    }
    
    msgBox.appendChild(msg);

    if (sender=="myMsg") {
        time.classList.add('time1');
        fullMsgwithTime.appendChild(msgBox);
        fullMsgwithTime.appendChild(time);
    }
    else{
        time.classList.add('time2');
        msgBox.style.background ='#202C36';
        fullMsgwithTime.appendChild(time);
        fullMsgwithTime.appendChild(msgBox);
    }



    wholeMsgBox.appendChild(fullMsgwithTime);

}