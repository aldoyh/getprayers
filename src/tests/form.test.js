import { render, fireEvent } from '@testing-library/svelte';
import Form from '../lib/Form.svelte';

test('form renders correctly', () => {
    const { getByText } = render(Form, {
        props: {
            cinemaType: '',
            selectedCategories: [],
            specificDescriptors: '',
            loading: false
        }
    });
    
    expect(getByText('What kind of cinema are you searching for?')).toBeInTheDocument();
    expect(getByText('Select all categories that you want the show or movie to include.')).toBeInTheDocument();
    expect(getByText('Write any other specifications here. Be as picky as you\'d like.')).toBeInTheDocument();
});

test('button click changes cinema type', async () => {
    const { getByText } = render(Form, {
        props: {
            cinemaType: '',
            selectedCategories: [],
            specificDescriptors: '',
            loading: false
        }
    });
    
    const button = getByText('TV Show');
    await fireEvent.click(button);
    expect(button).toHaveClass('bg-pink-600/40');
});
