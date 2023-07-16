import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Alert, Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {theme} from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Fontisto} from '@expo/vector-icons';
import {Checkbox} from 'react-native-paper';
import dayjs from "dayjs";

const STORAGE_KEY = "@toDos";

interface ToDoItem {
    text: string;
    working: boolean;
    checked: boolean;
}

export default function App() {
    const [working, setWorking] = useState(true);
    const travle = () => setWorking(false);
    const work = () => setWorking(true);
    const [checked, setChecked] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    //todolist obj
    const [toDos, setToDos] = useState<{ [key: string]: ToDoItem }>({});

    //텍스트인풋
    const [text, setText] = useState<string>("");
    const onChangeText = (payload: string) => setText(payload);

    //async스토리지
    const saveToDos = async (toSave: unknown) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)) //Object to String
    }

    const loadToDos = async () => {
        try {
            const s = await AsyncStorage.getItem(STORAGE_KEY)
            //String to Object
            if (s != null) {
                setToDos(JSON.parse(s))
            }

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        loadToDos();
    }, [])

    //Submit
    const addToDo =  () => {
        if (text === "") {
            return
        }
        //todo 저장 Object.assign 오브젝트 합치기
        const newToDos = {...toDos, [dayjs().format('YYYY-MM-DD HH:mm:ss')]: {text, working, checked}}
        setToDos(newToDos)

        //텍스트 초기화
        setText("")
        onChangeText("")

        //스토리지에 저장
        saveToDos(newToDos)
        setModalVisible(!modalVisible)
    }

    //Todo 삭제
    //삭제하기 위해 원래 오브젝트 복제하고 삭제하고 set
    const deleteToDo = (key: string) => {
        if (Platform.OS === "web") {
            const ok = confirm("삭제하시겠습니까?");
            if (ok) {
                const newToDos = {...toDos}
                delete newToDos[key]
                setToDos(newToDos)
                saveToDos(newToDos)
            }
        }
        Alert.alert("삭제 메세지?", "정말 삭제하시겠습니까?", [
            {text: "Cancel"},
            {
                text: "I'm Sure", onPress: async () => {
                    const newToDos = {...toDos}
                    delete newToDos[key]
                    setToDos(newToDos)
                    await saveToDos(newToDos)
                }
            }
        ]);
    }

    //Todo 체크
    const checkToDo = async (key: string) => {
        const newToDos = {...toDos}
        const temp = newToDos[key].checked

        newToDos[key].checked = !temp

        setToDos(newToDos)
        await saveToDos(newToDos)
    }


    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>실적 계산기</Text>
                </TouchableOpacity>
            </View>
            <View >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>실적을 입력하세요</Text>
                            <TextInput
                                placeholder="실적을 입력하세요"
                                style={styles.input}
                                onChangeText={onChangeText}
                                value={text}
                            />
                            <Pressable
                                // style={[styles.modalbutton, styles.buttonClose]}
                                // onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Hide Modal</Text>
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={addToDo}>
                                        <Text style={styles.buttontext}>등록</Text>
                                    </TouchableOpacity>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textStyle}>등록</Text>
                </Pressable>
            </View>

            {/*<TextInput*/}
            {/*    placeholder="실적을 입력하세요"*/}
            {/*    style={styles.input}*/}
            {/*    onChangeText={onChangeText}*/}
            {/*    value={text}*/}
            {/*/>*/}

            {/*<View>*/}
            {/*    <TouchableOpacity style={styles.button} onPress={addToDo}>*/}
            {/*        <Text style={styles.buttontext}>등록</Text>*/}
            {/*    </TouchableOpacity>*/}
            {/*</View>*/}

            <ScrollView>
                {
                    Object.keys(toDos).map((key) => (
                        <View style={styles.toDo} key={key}>
                            <Text
                                style={{
                                    ...styles.toDoText,
                                    textDecorationLine: toDos[key].checked ? 'line-through' : undefined,
                                    color: toDos[key].checked ? 'green' : 'white'
                                }}>
                                {key}{'\n'}
                                {toDos[key].text}
                            </Text>

                            <View style={styles.btnView}>
                                <Checkbox key={key}
                                          status={toDos[key].checked ? 'checked' : 'unchecked'}
                                          onPress={() => {
                                              checkToDo(key);
                                          }}
                                          color="green"
                                />

                                <TouchableOpacity onPress={() => deleteToDo(key)}>
                                    <Fontisto name="trash" size={18} color="white"/>
                                </TouchableOpacity>
                            </View>

                        </View>
                    ))}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(85,47,47,0.57)",
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100
    },
    btnText: {
        fontSize: 30,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 20,
        fontSize: 18,
        marginBottom: 15,
    },
    button: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        // marginTop: 20,
        fontSize: 18,
        marginBottom: 15,
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
    buttontext: {
        color: "#fff",
        fontSize: 24,
    },
    toDo: {
        flex: 1,
        backgroundColor: theme.grey,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toDoText: {
        flex: 0.7,
        fontSize: 16,
        fontWeight: "500",
    },
    btnView: {
        flex: 0.3,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    // centeredView: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: 22,
    // },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalbutton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});