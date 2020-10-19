import React, {useState } from 'react'
import { View, ScrollView, Text, TextInput } from 'react-native'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage'

import {Feather} from '@expo/vector-icons'

import PageHeader from '../../componentes/PageHeader'
import TeacherItem, { Teacher } from '../../componentes/TeacherItem'

import api from '../../services/api'
import styles from './styles'
import { useFocusEffect } from '@react-navigation/native'

function TeacherList(){

    const [favorites, setFavorites] = useState<number[]>([])

    const [teachers, setTeachers] = useState([])

    const [subject, setSubject] = useState('')
    const [week_day, setWeek_day] = useState('')
    const [time, setTime] = useState('')

    const [isFiltersVisible, setIsFiltersVisible] = useState(false)

    function loadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response)
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id
                })
                setFavorites(favoritedTeachersIds)
            }
        })
    }

    useFocusEffect(()=>{
        loadFavorites()
    })

    function handleToggleFiltersVisible(){
        setIsFiltersVisible(!isFiltersVisible)
    }

    async function handleFilterSubmit(){

        loadFavorites()
        const response = await api.get('/classes', {
            params: {
                subject,
                week_day,
                time
            }
        })

        setIsFiltersVisible(false)
        setTeachers(response.data)
    }

    return (
        <View style={styles.container} >
            <PageHeader title="Proffys Disponíveis" headerRight={(
                <BorderlessButton onPress={handleToggleFiltersVisible}>
                    <Feather name="filter" size={26} color="#fff"/>
                </BorderlessButton>
            )}>

                    {isFiltersVisible &&(
                        <View style={styles.searchForm}>
                            <Text style={styles.label}>Matéria</Text>
                            <TextInput 
                                value={subject}
                                onChangeText={text => setSubject(text)}
                                placeholderTextColor="#c1bccc"
                                style={styles.input}
                                placeholder="Qual a matéria?"/>

                            <View style={styles.inputGroup}>

                                <View style={styles.inputBlock}>
                                    <Text style={styles.label}>Dia da Semana</Text>
                                    <TextInput
                                        value={week_day}
                                        onChangeText={text => setWeek_day(text)}
                                        placeholderTextColor="#c1bccc"
                                        style={styles.input}
                                        placeholder="Qual o dia?" />

                                </View>

                                <View style={styles.inputBlock}>

                                    <Text style={styles.label}>Horário</Text>
                                    <TextInput
                                        value={time}
                                        onChangeText={text => setTime(text)}
                                        placeholderTextColor="#c1bccc"
                                        style={styles.input}
                                        placeholder="Qual horário?" />

                                </View>
                            </View>

                            <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Filtrar</Text>
                            </RectButton>
                        </View>
                    )}
            </PageHeader>

            <ScrollView 
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal:16,
                    paddingBottom:16
                }}>

                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            favorited={favorites.includes(teacher.id)}
                            key={teacher.id} 
                            teacher={teacher}/>
                    )})}

            </ScrollView>
            
        </View>
    )
}

export default TeacherList