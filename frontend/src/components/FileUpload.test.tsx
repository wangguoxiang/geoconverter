import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // 确保导入 jest-dom 扩展
import FileUpload from './FileUpload';
import { uploadFile } from '../api';

jest.mock('../api', () => ({
    uploadFile: jest.fn(),
}));

describe('FileUpload Component', () => {
    const setFileIdMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders upload button', () => {
        render(<FileUpload setFileId={setFileIdMock} />);
        expect(screen.getByText(/Upload CSV/i)).toBeInTheDocument();
    });

    test('uploads file successfully', async () => {
        const mockFile = new File(['hello'], 'hello.csv', { type: 'text/csv' });
        (uploadFile as jest.Mock).mockResolvedValue({ data: { fileId: '123' } });

        render(<FileUpload setFileId={setFileIdMock} />);
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [mockFile] } });

        expect(uploadFile).toHaveBeenCalledWith(mockFile);
        expect(setFileIdMock).toHaveBeenCalledWith('123');
        expect(screen.getByText(/hello\.csv file uploaded successfully/i)).toBeInTheDocument();
    });

    test('handles upload error', async () => {
        const mockFile = new File(['hello'], 'hello.csv', { type: 'text/csv' });
        (uploadFile as jest.Mock).mockRejectedValue(new Error('Upload failed'));

        render(<FileUpload setFileId={setFileIdMock} />);
        const input = screen.getByLabelText(/upload csv/i);
        fireEvent.change(input, { target: { files: [mockFile] } });

        expect(uploadFile).toHaveBeenCalledWith(mockFile);
        expect(setFileIdMock).not.toHaveBeenCalled();
        expect(screen.getByText(/hello\.csv file upload failed\./i)).toBeInTheDocument();
    });
});