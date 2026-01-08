// Example usage of Toast Notifications in your components

import { useToast } from '@/components/ui/ToastProvider';

// In any component:
function MyComponent() {
    const toast = useToast();

    // Success notification
    const handleSuccess = () => {
        toast.success('Operation completed successfully!');
    };

    // Error notification
    const handleError = () => {
        toast.error('Something went wrong. Please try again.');
    };

    // Info notification
    const handleInfo = () => {
        toast.info('Here is some useful information.');
    };

    // Warning notification
    const handleWarning = () => {
        toast.warning('Please review this before proceeding.');
    };

    // Custom duration (default is 4000ms)
    const handleCustomDuration = () => {
        toast.success('This will disappear in 2 seconds', 2000);
    };

    return (
        <div>
            <button onClick={handleSuccess}>Show Success</button>
            <button onClick={handleError}>Show Error</button>
            <button onClick={handleInfo}>Show Info</button>
            <button onClick={handleWarning}>Show Warning</button>
        </div>
    );
}

// Real-world examples:

// 1. After form submission
const handleSubmit = async (data) => {
    try {
        await submitForm(data);
        toast.success('Form submitted successfully!');
    } catch (error) {
        toast.error('Failed to submit form');
    }
};

// 2. After data update
const handleUpdate = async () => {
    try {
        await updateData();
        toast.success('Data updated successfully!');
    } catch (error) {
        toast.error(error.message);
    }
};

// 3. Validation warnings
const handleValidation = () => {
    if (!isValid) {
        toast.warning('Please fill in all required fields');
        return;
    }
    // proceed...
};

// 4. Info messages
const handleInfo = () => {
    toast.info('Your changes have been saved automatically');
};
