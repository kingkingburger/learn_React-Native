import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";



const Stack = createStackNavigator();

function StackScreen() {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
        >
            {/*<Stack.Screen name="Splash" component={Splash} />*/}
            {/*<Stack.Screen name="Signin" component={Signin} />*/}
            {/*<Stack.Screen name="KaKaoLogin" component={KaKaoLogin} />*/}
            {/*<Stack.Screen name="Signup" component={Signup} />*/}
            {/*<Stack.Screen name="Home" component={Home} />*/}
        </Stack.Navigator>
    );
}

function Navigation() {
    return (
        <NavigationContainer>
            <StackScreen />
        </NavigationContainer>
    );
}

export default Navigation;