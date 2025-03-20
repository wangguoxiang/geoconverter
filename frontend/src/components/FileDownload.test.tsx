import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // 修改此处导入路径
import FileDownload from './FileDownload';
import { downloadFile } from '../api';

jest.mock('../api', () => ({
    downloadFile: jest.fn(),
}));

describe('FileDownload Component', () => {
    const fileId = '123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders download button', () => {
        render(<FileDownload fileId={fileId} disabled={false} />);
        expect(screen.getByText(/Download CSV/i)).toBeInTheDocument();
    });

    test('downloads file successfully', async () => {
        const mockBlob = new Blob(['hello'], { type: 'text/csv' });
        (downloadFile as jest.Mock).mockResolvedValue({ data: mockBlob });

        render(<FileDownload fileId={fileId} disabled={false} />);
        fireEvent.click(screen.getByText(/Download CSV/i));

        expect(downloadFile).toHaveBeenCalledWith(fileId);
        expect(screen.getByText(/File downloaded successfully/i)).toBeInTheDocument();
    });

    test('handles download error', async () => {
        (downloadFile as jest.Mock).mockRejectedValue(new Error('Download failed'));

        render(<FileDownload fileId={fileId} disabled={false} />);
        fireEvent.click(screen.getByText(/Download CSV/i));

        expect(downloadFile).toHaveBeenCalledWith(fileId);
        expect(screen.getByText(/File download failed\./i)).toBeInTheDocument();
    });

    test('disables button when fileId is empty', () => {
        render(<FileDownload fileId="" disabled={true} />);
        expect(screen.getByText(/Download CSV/i)).toBeDisabled();
    });

    test('enables button when fileId is not empty and disabled is false', () => {
        render(<FileDownload fileId="testFileId" disabled={false} />);
        expect(screen.getByText(/Download CSV/i)).not.toBeDisabled();
    });
});