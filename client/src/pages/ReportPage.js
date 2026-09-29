import '../styles/pages/ReportPage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const reasons = ['Spam', 'Harassment', 'Misinformation', 'Unsafe content', 'Other'];

const ReportPage = () => {
	const navigate = useNavigate();
	const [reason, setReason] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!reason) {
			toast.error('Select a reason for your report');
			return;
		}
		toast.success('Report submitted for review');
		navigate('/home');
	};

	return (
		<section className="report-page">
			<div className="report-container">
				<button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
				<div className="report-header">
					<Flag size={30} className="report-reason-card-icon" />
					<h1 className="report-title">Report a concern</h1>
					<p className="report-subtitle">Help keep FocusFeed useful and respectful. Your report will be reviewed by the safety team.</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="report-section">
						<h2 className="report-section-title">What is the issue?</h2>
						<div className="report-reasons-grid">
							{reasons.map((item) => (
								<button type="button" key={item} className={`report-reason-card ${reason === item ? 'selected' : ''}`} onClick={() => setReason(item)}>
									<span className="report-reason-card-text">{item}</span>
								</button>
							))}
						</div>
					</div>
					<div className="report-section">
						<label className="report-section-title" htmlFor="report-description">Add details</label>
						<textarea id="report-description" className="report-description-textarea" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell us what happened" />
					</div>
					<button className="btn btn-primary" type="submit"><Send size={17} /> Submit report</button>
				</form>
			</div>
		</section>
	);
};

export default ReportPage;
