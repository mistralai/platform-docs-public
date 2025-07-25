// CustomSelect.jsx
import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';

// Icon component
const Icon = ({ isOpen }) => {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth='1.5'
      fill='none'
      opacity='0.7'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={isOpen ? 'translate' : ''}
    >
      <polyline points='6 9 12 15 18 9'></polyline>
    </svg>
  );
};

// CloseIcon component
const CloseIcon = () => {
  return (
    <svg
      viewBox='0 0 24 24'
      width='14'
      height='14'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      style={{
        opacity: 0.7,
      }}
    >
      <line x1='18' y1='6' x2='6' y2='18'></line>
      <line x1='6' y1='6' x2='18' y2='18'></line>
    </svg>
  );
};

// CustomSelect component
const CustomSelect = ({
  placeHolder,
  options,
  isMulti,
  isSearchable,
  onChange,
  align,
}) => {
  // State variables using React hooks
  const [showMenu, setShowMenu] = useState(false); // Controls the visibility of the dropdown menu
  const [selectedValue, setSelectedValue] = useState(isMulti ? [] : null); // Stores the selected value(s)
  const [searchValue, setSearchValue] = useState(''); // Stores the value entered in the search input
  const searchRef = useRef(); // Reference to the search input element
  const inputRef = useRef(); // Reference to the custom select input element
  const [menuDirection, setMenuDirection] = useState("down"); // Controls the direction of the dropdown menu

  useEffect(() => {
    setSearchValue('');
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  });

  useLayoutEffect(() => {
    const updateMenuDirection = () => {
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
          setMenuDirection('up');
        } else {
          setMenuDirection('down');
        }
      }
    };

    updateMenuDirection();
    window.addEventListener('resize', updateMenuDirection);
    return () => {
      window.removeEventListener('resize', updateMenuDirection);
    };
  }, [showMenu]);

  const handleInputClick = (e) => {
    setShowMenu(!showMenu);
  };

  const getSelectedValueDisplay = useCallback(() => {
    if (!selectedValue || selectedValue.length === 0) {
      return placeHolder;
    }
    if (isMulti) {
      return (
        <div className='dropdown-tags'>
          {selectedValue.map((option, index) => (
            <div key={`${option.value}-${index}`} className='dropdown-tag-item'>
              {option.label}
              <span
                onClick={(e) => onOptionRemove(e, option)}
                className='dropdown-tag-close'
              >
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
      );
    }
    return selectedValue.label;
  }, [selectedValue, isMulti, placeHolder]);

  const removeOption = (option) => {
    return selectedValue.filter((o) => o.value !== option.value);
  };

  // When a selected option is removed
  const onOptionRemove = (e, option) => {
    e.stopPropagation();
    const newValue = removeOption(option);
    setSelectedValue(newValue);
    onChange(newValue);
  };

  // When an option is selected
  const onOptionClick = (option) => {
    let newValue;
    if (isMulti) {
      if (selectedValue.findIndex((o) => o.value === option.value) >= 0) {
        newValue = removeOption(option);
      } else {
        newValue = [...selectedValue, option];
      }
    } else {
      newValue = option;
    }
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isOptionSelected = (option) => {
    if (isMulti) {
      return selectedValue.filter((o) => o.value === option.value).length > 0;
    }

    if (!selectedValue) {
      return false;
    }

    return selectedValue.value === option.value;
  };

  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getOptions = useCallback(() => {
    if (!searchValue) {
      return options || []; // Ensure options is an array
    }
    return (options || []).filter(
      (option) =>
        option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    );
  }, [options, searchValue]);

  return (
    <div
      style={{
        position: 'relative',
        width: 'fit-content',
        height: '53px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className='custom--dropdown-container'>
        <div
          ref={inputRef}
          onClick={handleInputClick}
          className='dropdown-input'
        >
          <div
            className={`dropdown-selected-value ${
              !selectedValue || selectedValue.length === 0 ? 'placeholder' : ''
            }`}
          >
            {getSelectedValueDisplay()}
          </div>
          <div className='dropdown-tools'>
            <div className='dropdown-tool'>
              <Icon isOpen={showMenu} />
            </div>
          </div>
        </div>

        {showMenu && (
          <div
            className={`dropdown-menu alignment--${align || 'auto'} ${
              menuDirection === 'up' ? 'menu-up' : 'menu-down'
            }`}
          >
            {isSearchable && (
              <div className='search-box'>
                <input
                  className='form-control'
                  onChange={onSearch}
                  value={searchValue}
                  ref={searchRef}
                />
              </div>
            )}
            <div style={{ paddingBottom: '0.5rem' }}>
              {getOptions().map((option) => (
                <div
                  onClick={() => onOptionClick(option)}
                  key={option.value}
                  className={`dropdown-item ${
                    isOptionSelected(option) && 'selected'
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;