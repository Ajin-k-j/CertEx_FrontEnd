import React, { useEffect, useState } from 'react';
import DatePickerComponent from '../DatePicker/DatePicker'; // Adjust the path as needed

interface ProviderDetails {
  providerName: string;
  certificationOfficialLink: string;
}

interface NominationDates {
  nominationOpenDate: string;
  nominationCloseDate: string;
}

const UserPendingActionStep3 = ({ nominationId }: { nominationId: number }) => {
  const [providerDetails, setProviderDetails] = useState<ProviderDetails | null>(null);
  const [nominationDates, setNominationDates] = useState<NominationDates | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Fetch provider details and nomination dates from API
  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7209/api/UserActionFlow/${nominationId}/provider-details`);
        const data: ProviderDetails = await response.json();
        setProviderDetails(data);
      } catch (error) {
        console.error('Error fetching provider details:', error);
      }
    };

    const fetchNominationDates = async () => {
      try {
        const response = await fetch(`https://localhost:7209/api/UserActionFlow/${nominationId}/nomination-dates`);
        const data: NominationDates = await response.json();
        setNominationDates(data);
      } catch (error) {
        console.error('Error fetching nomination dates:', error);
      }
    };

    fetchProviderDetails();
    fetchNominationDates();
  }, [nominationId]);


  const handleSaveDate = (date: string) => {
    setSelectedDate(date);
  };

  if (!providerDetails || !nominationDates) {
    return <div>Loading...</div>; // You can customize this as per your design.
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
      <div>
        <strong>Certification Provider:</strong> {providerDetails.providerName}
      </div>

      {providerDetails.providerName === 'AWS' && (
          <div style={{ marginTop: '10px' }}>
            Note: Check your mail for account credentials
          </div>)}
          <>
          <div style={{ marginTop: '10px' }}>
            <strong>Click on the link for registration:</strong>
          </div>
          <div>
            <a
              href={providerDetails.certificationOfficialLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Certification Registration Link
            </a>
          </div>

          {/* Render DatePickerComponent directly below the registration link */}
          {nominationDates && (
            <DatePickerComponent
              nominationId={nominationId}
              onSave={handleSaveDate}
              nominationOpenDate={nominationDates.nominationOpenDate}
              nominationCloseDate={nominationDates.nominationCloseDate}
            />
          )}
        </>
      
    </div>
  );
};

export default UserPendingActionStep3;
