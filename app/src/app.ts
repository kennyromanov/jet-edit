import { nanoid } from 'nanoid';
import { createEditor } from '@core';
import './app.css';

export function selectFile(): Promise<File | null> {
    return new Promise(resolve => {

        // Getting the picker

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*/*';
        input.style.display = 'none';

        document.body.appendChild(input);


        // Getting the file

        input.addEventListener('change', async () => {
            const file = input.files[0] ?? null;


            // Doing some checks

            if (!file) {
                console.log('Unable to open file: The file is not selected');

                document.body.removeChild(input);

                return resolve(null);
            }


            // Removing the picker

            document.body.removeChild(input);


            resolve(file);
        });


        // Calling the picker

        input.click();
    });
}

export async function selectDocument(): Promise<any> {

    // Getting the file

    const file = await selectFile();

    if (!file) return null;


    // Getting the data

    const data = await file.text();


    return {
        id: nanoid(),
        name: file?.name || 'Unknown Document',
        data: data,
    };
}

createEditor('#app', { selectDocument });
