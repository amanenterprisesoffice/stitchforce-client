'use client';

import State from '@/components/StateComponent';
import Loader from '@/components/ui/Loader';
import useFetch from '@/hooks/useFetch';
import { useParams } from 'next/navigation';
import MultiStepForm from '@/components/MultiStepForm';

const CreateTemplate = () => {
    const { slug } = useParams();

    const { data, error, isLoading } = useFetch({
        url: `/api/questions?slug=${slug}`,
        method: 'GET',
        withAuth: true,
        auto: true,
        onSuccess: (data) => console.log('Fetched questions:', data),
        onError: (error) => console.error('Error fetching questions:', error),
    });

    const { refetch: createWebsite, isLoading: isSubmitting, error: submitError } = useFetch({
        url: '/api/template/create-website',
        method: 'POST',
        onSuccess: (data) => console.log('Template submitted successfully:', data),
        onError: (error) => console.error('Error submitting template:', error),
    });



    const handleFormSubmit = (formData: any) => {
        const formPayload = new FormData();

        // Append the slug as a text field
        formPayload.append("slug", slug?.toString() || "");

        // Iterate over formData to categorize it into 'text' and 'imgs'
        Object.keys(formData).forEach((key) => {
            const value = formData[key];
            if (Array.isArray(value) && value.every(item => item instanceof File)) {
                value.forEach((file: File) => {
                    formPayload.append("images", file);
                });
            } else if (typeof value === 'string' || typeof value === 'number') {
                formPayload.append(key, value.toString());
            }
        });

        createWebsite({
            url: '/api/template/create-website',
            method: 'POST',
            payload: formPayload,
        });
    };


    let loaderText = '';

    if (isLoading) {
        loaderText = 'Loading Onboarding';
    } else if (isSubmitting) {
        loaderText = 'Creating Your Website';
    }




    if (isLoading || isSubmitting) return <Loader text={loaderText} />;
    if (error) return <State message={`Error fetching data: ${error}`} />;
    if (submitError) return <State message={`Error submitting form: ${submitError}`} />;
    if (!data || data.length === 0) return <State message="No questions found." />;

    return (
        <div className='flex justify-center items-center h-full'>
            <MultiStepForm questions={data.questions} onSubmit={handleFormSubmit} />
        </div>
    );
};

export default CreateTemplate;
