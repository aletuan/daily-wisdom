// Onboarding options for the AI coaching feature
export const getOnboardingOptions = (lang = 'en') => {
    const options = {
        en: [
            { id: 'direction', label: 'Finding direction' },
            { id: 'habits', label: 'Building better habits' },
            { id: 'stress', label: 'Dealing with stress' },
            { id: 'growth', label: 'Personal growth' },
            { id: 'custom', label: "I'll write what I'm feeling" },
        ],
        vi: [
            { id: 'direction', label: 'Tìm kiếm định hướng' },
            { id: 'habits', label: 'Xây dựng thói quen tốt' },
            { id: 'stress', label: 'Đối diện với căng thẳng' },
            { id: 'growth', label: 'Phát triển bản thân' },
            { id: 'custom', label: "Tôi muốn viết ra cảm xúc của mình" },
        ]
    };
    return options[lang] || options.en;
};
