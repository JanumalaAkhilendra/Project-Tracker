import { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const JoinProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      return setError('Invite code is required');
    }

    try {
      await onSubmit(inviteCode);
      setInviteCode('');
      setError('');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Project">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <Input
            id="inviteCode"
            label="Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
            placeholder="Enter 6-digit code"
          />
          <p className="mt-2 text-sm text-gray-500">
            Get the invite code from the project owner
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button type="submit">
            Join Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinProjectModal;