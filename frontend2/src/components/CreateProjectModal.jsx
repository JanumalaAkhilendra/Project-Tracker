import { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return setError('Project name is required');
    }

    onSubmit({
      name,
      description,
      deadline: deadline || undefined
    });
    
    // Reset form
    setName('');
    setDescription('');
    setDeadline('');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <Input
          id="projectName"
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4 text-black"
        />
        
        <Input
          id="projectDescription"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          textarea
          rows={3}
          className="mb-4 text-black"
        />
        
        <Input
          id="projectDeadline"
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="mb-6 text-black"
        />
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;