import React from 'react';

export default function ContactInfo() {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
      
    
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.3rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', color: '#0056b3' }}>
           Primary Contact Details
        </h3>
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> <a href="mailto:placements@skit.ac.in" style={{ color: '#0056b3', textDecoration: 'none' }}>placements@skit.ac.in</a></li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Phone:</strong> +91 123 456 7890 (Ext: 101)</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Office:</strong> Placement Cell, Ground Floor, CS Block, SKIT JAIPUR</li>
        </ul>
      </section>

     
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', color: '#0056b3' }}>
          Working Hours
        </h3>
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Monday to Saturday:</strong> 8:00 AM – 4:00 PM</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Sunday:</strong> Closed</li>
        </ul>
      </section>

      {/* Department-Specific Contacts */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem', color: '#0056b3' }}>
          Department-Specific Contacts
        </h3>
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
          <li style={{ marginBottom: '0.8rem' }}>
            <strong>Technical Support:</strong> <br/>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>(For dashboard & login issues)</span> <br/>
            <a href="mailto:support-tech@skit.ac.in" style={{ color: '#0056b3', textDecoration: 'none' }}>support-tech@skit.ac.in</a>
          </li>
          <li style={{ marginBottom: '0.8rem' }}>
            <strong>Chief Placement Officer:</strong> <br/>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>(For corporate queries & escalations)</span> <br/>
            <a href="mailto:cpo@skit.ac.in" style={{ color: '#0056b3', textDecoration: 'none' }}>cpo@skit.ac.in</a>
          </li>
        </ul>
      </section>

      {/* Urgent Queries */}
      <section style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #ffc107' }}>
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#856404' }}>
          ⚠️ Urgent Queries
        </h3>
        <p style={{ margin: 0, color: '#856404', fontSize: '0.95rem' }}>
          <strong>Interview Day Helpline:</strong> +91 987 654 3210 <br/>
          <em>*Please use this number strictly for emergencies on the day of a scheduled interview or test.</em>
        </p>
      </section>

    </div>
  );
}