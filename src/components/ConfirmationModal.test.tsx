import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from './ConfirmationModal';
import React from 'react';

const setup = (overrides: Partial<React.ComponentProps<typeof ConfirmationModal>> = {}) => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const props: React.ComponentProps<typeof ConfirmationModal> = {
        isOpen: true,
        title: 'Delete item',
        message: 'Are you sure?',
        confirmText: 'Yes, delete',
        cancelText: 'Cancel',
        onConfirm,
        onCancel,
        type: 'warning',
        ...overrides,
    };
    const utils = render(<ConfirmationModal {...props} />);
    return { ...utils, onConfirm, onCancel };
};

describe('ConfirmationModal', () => {
    test('does not render when isOpen=false', () => {
        render(
            <ConfirmationModal
                isOpen={false}
                title="t"
                message="m"
                onConfirm={() => { }}
                onCancel={() => { }}
            />
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByText('t')).not.toBeInTheDocument();
        expect(screen.queryByText('m')).not.toBeInTheDocument();
    });


    test('renders title and message when open', () => {
        setup();
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /delete item/i })).toBeInTheDocument();
        expect(screen.getByText(/are you sure\?/i)).toBeInTheDocument();
    });

    test('calls onConfirm when confirm button clicked', async () => {
        const user = userEvent.setup();
        const { onConfirm } = setup();
        await user.click(screen.getByRole('button', { name: /yes, delete/i }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when cancel button clicked', async () => {
        const user = userEvent.setup();
        const { onCancel } = setup();
        await user.click(screen.getByRole('button', { name: /cancel/i }));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('pressing Escape triggers onCancel', () => {
        const { onCancel } = setup();
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('clicking backdrop (outside modal) triggers onCancel', async () => {
        const user = userEvent.setup();
        const { onCancel } = setup();
        const backdrop = screen.getByRole('dialog');
        await user.click(backdrop);
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('when cancelText is an empty string, no cancel button is rendered', () => {
        setup({ cancelText: '' });
        expect(screen.queryByRole('button', { name: /cancel/i })).toBeNull();
        expect(screen.getByRole('button', { name: /confirm|yes|ok/i })).toBeInTheDocument();
    });

    test('applies type class names to title and confirm button', () => {
        setup({ type: 'danger', confirmText: 'Delete' });
        const title = screen.getByRole('heading', { name: /delete item/i });
        const confirmBtn = screen.getByRole('button', { name: /delete/i });
        expect(title.className).toMatch(/danger/);
        expect(confirmBtn.className).toMatch(/danger/);
    });

    test('removes Escape listener on unmount', () => {
        const onCancel = jest.fn();
        const { unmount } = render(
            <ConfirmationModal
                isOpen
                title="t"
                message="m"
                onConfirm={() => { }}
                onCancel={onCancel}
            />
        );
        unmount();
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onCancel).not.toHaveBeenCalled();
    });
});