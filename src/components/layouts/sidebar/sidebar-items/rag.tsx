import React, { useState } from 'react';
import { FileInput, rem, Button, Textarea } from '@mantine/core';
import { IconFileCv } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const FILE_UPLOAD_URL = 'https://ai.bhdl.online/rag/upload/requirement';
const TEXT_UPLOAD_URL = 'https://ai.bhdl.online/rag/upload/text';

const RAG = () => {
	const [file, setFile] = useState(null);
	const [text, setText] = useState('');

	const icon = <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

	const submit = async () => {
		if (!file && !text) {
			toast.error('Please upload a file or enter text');
			return;
		}

		toast.loading('Uploading...');
		if (file) {
			const formData = new FormData();
			formData.append('file', file);

			try {
				await axios.post(FILE_UPLOAD_URL, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
			} catch (error) {
				toast.dismiss();
				toast.error('Upload file failed');
				return;
			}
		}

		if (text) {
			try {
				await axios.post(TEXT_UPLOAD_URL, { text });
			} catch (error) {
				toast.dismiss();
				toast.error('Upload text failed');
				return;
			}
		}

		toast.dismiss();
		toast.success('Upload complete');
	};

	return (
		<div className="flex flex-col gap-4">
			<FileInput
				leftSection={icon}
				placeholder="Attach your document"
				leftSectionPointerEvents="none"
				radius="md"
				onChange={setFile}
				accept=".docx,.pdf"
			/>
			<Textarea
				placeholder="Enter your text here"
				radius="md"
				autosize
				minRows={5}
				onChange={(event) => setText(event.currentTarget.value)}
			/>

			<Button
				fullWidth
				variant="light"
				onClick={submit}
			>
				Submit
			</Button>
		</div>
	)
}

export default RAG;
