
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        todos: [
            "Reflect on what parts of your work bring you joy.",
            "Identify one passion project you can start today.",
            "Share your enthusiasm with a colleague or friend."
        ]
    },
    {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon",
        todos: [
            "Take a spontaneous walk without a destination.",
            "Say 'yes' to an unplanned invitation.",
            "Spend 10 minutes just observing your surroundings."
        ]
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        todos: [
            "Write down one big dream you have for the future.",
            "Create a vision board or collage representing your dream.",
            "Take one small step today towards that dream."
        ]
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius",
        todos: [
            "Identify a goal you've been neglecting.",
            "Commit to working on it for just 5 minutes today.",
            "Forgive yourself for past delays and focus on today's progress."
        ]
    },
    {
        text: "In the end, it's not the years in your life that count. It's the life in your years.",
        author: "Abraham Lincoln",
        todos: [
            "Do something today that makes you feel truly alive.",
            "Reconnect with an old friend.",
            "Try a new activity you've always wanted to do."
        ]
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker",
        todos: [
            "Set a specific goal for next week.",
            "Draft a plan to achieve that goal.",
            "Take the first action step immediately."
        ]
    },
    {
        text: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky",
        todos: [
            "Identify an opportunity you've been hesitating to seize.",
            "Take a calculated risk today.",
            "Ask for something you want, even if you might get a 'no'."
        ]
    },
    {
        text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        author: "Winston Churchill",
        todos: [
            "Reflect on a past failure and what you learned from it.",
            "Celebrate a recent small win.",
            "Encourage someone else who is struggling."
        ]
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        todos: [
            "Write down 3 of your strengths.",
            "Visualize yourself succeeding at a current challenge.",
            "Replace one negative thought with a positive affirmation."
        ]
    },
    {
        text: "Strive not to be a success, but rather to be of value.",
        author: "Albert Einstein",
        todos: [
            "Help a colleague or neighbor with a task.",
            "Share your knowledge on a topic with someone.",
            "Ask yourself 'How can I serve others today?'"
        ]
    }
];

export default function QuoteScreen() {
    const [quote, setQuote] = useState({ text: '', author: '', todos: [] });
    const [completedTodos, setCompletedTodos] = useState([]);

    useEffect(() => {
        getRandomQuote();
    }, []);

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
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
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    quoteContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 24,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        lineHeight: 32,
    },
    authorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'right',
        width: '100%',
    },
    todoContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        marginBottom: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    todoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    todoItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#007AFF',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    todoText: {
        fontSize: 16,
        color: '#444',
        flex: 1,
        lineHeight: 24,
    },
    todoTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
