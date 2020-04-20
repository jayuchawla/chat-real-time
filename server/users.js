////adding users managing users are handled using helper functions here
const users = []

const addUser = ({ id,name,room }) => {

    //first convert room and name in a code understandable format no spaces all lowercase // for eg: Jayu rocks ----> jayurocks
    
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()

    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(existingUser){
        return{ error: `Username is already taken for room: ${room}`};
    }

    const user = { id,name,room };
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    
    if(index !== -1){
        ///from the index value index remove one entry and return it
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const user = users.find((user) => user.id === id);
    if(user){
        return user;
    }
}

const getUsersInRoom = (room) => {

    const allusers = users.filter((user)=> user.room === room);
    return allusers;
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom };