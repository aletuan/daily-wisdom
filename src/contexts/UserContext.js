import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserProfile, onAuthStateChange } from '../services/authService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUserProfile = async (forceRefresh = false) => {
        // If we already have a profile and not forcing refresh, don't fetch
        if (userProfile && !forceRefresh) {
            return;
        }

        setLoading(true);
        try {
            const { profile, error } = await getUserProfile();
            if (error) {
                // If no user logged in, profile is null, which is valid
                if (error.message === 'No user logged in') {
                    setUserProfile(null);
                    setError(null);
                } else {
                    setError(error);
                }
            } else {
                setUserProfile(profile);
                setError(null);
            }
        } catch (err) {
            console.error('Error loading user profile:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserProfile();

        // Listen for auth state changes
        const { data: authListener } = onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                loadUserProfile(true);
            } else if (event === 'SIGNED_OUT') {
                setUserProfile(null);
            }
        });

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ userProfile, loading, error, refreshProfile: () => loadUserProfile(true) }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
