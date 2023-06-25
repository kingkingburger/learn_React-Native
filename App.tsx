import React, { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";

interface Item {
    id: number;
    value: string;
}

const App = () => {
    const [newItem, setNewItem] = useState("");
    const [listOfItems, setListOfItems] = useState<Item[]>([]);

    const deleteItem = (id: number) => {
        const updatedList = listOfItems.filter((item) => item.id !== id);
        setListOfItems(updatedList);
    };

    const updateInput = (key: string, value: string) => {
        setNewItem(value);
    };

    const addItem = () => {
        if (newItem !== "") {
            const newItemObj: Item = {
                id: 1 + Math.random(),
                value: newItem.slice(),
            };

            setListOfItems((prevList) => [...prevList, newItemObj]);
            setNewItem("");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.textView}>
                <Text style={styles.text}>To Do List</Text>
            </View>
            <View>
                <TextInput
                    placeholder="  Type item here..."
                    style={styles.inputBox}
                    onChangeText={(text) => setNewItem(text)}
                    value={newItem}
                />
                <View>
                    <TouchableOpacity style={styles.button} onPress={addItem}>
                        <Text style={styles.buttontext}>+</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <ScrollView>
                        {listOfItems.map((item) => (
                            <View style={styles.listview} key={item.id}>
                                <Text style={styles.textstyle}> {item.value}</Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "maroon",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 10,
                                    }}
                                    onPress={() => deleteItem(item.id)}
                                >
                                    <Text style={{ color: "white" }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#48AAAD",
    },
    textView: {
        backgroundColor: "#ff0066",
        height: 80,
    },
    text: {
        textAlign: "center",
        marginTop: "10%",
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
    },
    inputBox: {
        backgroundColor: "white",
        textAlign: "center",
        fontSize: 20,
        height: 40,
    },
    button: {
        position: "absolute",
        right: 20,
        top: 200,
        backgroundColor: "maroon",
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 8,
    },
    buttontext: {
        color: "#fff",
        fontSize: 24,
    },
    textstyle: {
        fontSize: 20,
        color: "maroon",
    },
    listview: {
        borderWidth: 2,
        height: 40,
        justifyContent: "space-between",
        borderColor: "maroon",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
});

export default App;
