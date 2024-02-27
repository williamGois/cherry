import { Helmet } from 'react-helmet-async';

import { MeetingView } from 'src/sections/meeting/view';

// ----------------------------------------------------------------------

export default function MeetingPage() {
  return (
    <>
      <Helmet>
        <title> Meeting | Cherry </title>
      </Helmet>

      <MeetingView />
    </>
  );
}
