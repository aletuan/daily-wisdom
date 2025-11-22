
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { QUOTES } from '../data/quotes';
import { COLORS } from '../styles/colors';

export default function QuoteScreen() {
    const [quote, setQuote] = useState({ text: '', author: '', todos: [] });
    const [completedTodos, setCompletedTodos] = useState([]);

    useEffect(() => {
        getRandomQuote();
    }, []);

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        setQuote(QUOTES[randomIndex]);
        setCompletedTodos([]); // Reset completed todos for new quote
    };

    const toggleTodo = (index) => {
        setCompletedTodos(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>"{quote.text}"</Text>
                <Text style={styles.authorText}>- {quote.author}</Text>
            </View>

            {quote.todos && quote.todos.length > 0 && (
                <View style={styles.todoContainer}>
                    <Text style={styles.todoTitle}>Actionable Steps:</Text>
                    {quote.todos.map((todo, index) => {
                        const isCompleted = completedTodos.includes(index);
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.todoItem}
                                onPress={() => toggleTodo(index)}
                            >
                                <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                                    {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={[styles.todoText, isCompleted && styles.todoTextCompleted]}>
                                    {todo}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={getRandomQuote}>
                <Text style={styles.buttonText}>New Quote</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.softOffWhite,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    quoteContainer: {
        backgroundColor: COLORS.white,
        padding: 35,
        borderRadius: 20,
        elevation: 3,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, // Softer shadow
        shadowRadius: 8,
        marginBottom: 25,
        width: '100%',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.sageGreen,
    },
    quoteText: {
        fontSize: 22,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20,
        color: COLORS.darkBlueGrey,
        lineHeight: 34,
    },
    authorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.sageGreen,
        textAlign: 'right',
        width: '100%',
        letterSpacing: 0.5,
    },
    todoContainer: {
        backgroundColor: COLORS.white,
        padding: 25,
        borderRadius: 20,
        width: '100%',
        marginBottom: 30,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    todoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.mediumGrey,
        letterSpacing: 0.5,
    },
    todoItem: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8, // More rounded
        borderWidth: 2,
        borderColor: COLORS.sageGreen,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: COLORS.sageGreen,
    },
    checkmark: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    todoText: {
        fontSize: 16,
        color: COLORS.blueGrey,
        flex: 1,
        lineHeight: 24,
    },
    todoTextCompleted: {
        textDecorationLine: 'line-through',
        color: COLORS.lightGrey,
    },
    button: {
        backgroundColor: COLORS.sageGreen, // Sage Green
        paddingHorizontal: 35,
        paddingVertical: 16,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#81C784',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

