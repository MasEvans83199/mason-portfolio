const MultiLineInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    onExit: (value: string) => void;
}> = ({ value, onChange, onExit }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                onChange(value + '\n');
            } else {
                onExit(value);
            }
        }
    };

    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={10}
            className="multi-line-input"
            autoFocus
        />
    );
};

export default MultiLineInput;