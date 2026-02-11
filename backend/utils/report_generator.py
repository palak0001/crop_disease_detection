"""
PDF Report Generator for AgroGuard AI
Generate PDF reports for disease predictions
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, green, white
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak
from reportlab.lib import colors

# Reports directory
REPORTS_DIR = "static/reports"

# Create reports directory if it doesn't exist
os.makedirs(REPORTS_DIR, exist_ok=True)


def generate_pdf_report(
    username: str,
    image_path: str,
    predicted_class: str,
    predicted_class_display: str,
    confidence: float,
    treatment: str,
    medicine: str,
    date: str = None
) -> str:
    """Generate PDF report for disease prediction"""
    
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Create filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"report_{timestamp}.pdf"
    filepath = os.path.join(REPORTS_DIR, filename)
    
    # Create PDF document
    doc = SimpleDocTemplate(filepath, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for PDF elements
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=HexColor('#16a34a'),
        spaceAfter=6,
        alignment=1,  # Center
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=HexColor('#16a34a'),
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6
    )
    
    # Header
    elements.append(Paragraph("AgroGuard AI", title_style))
    elements.append(Paragraph("Plant Disease Prediction Report", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    
    # User and Date Information
    info_data = [
        [Paragraph("<b>User Name:</b>", normal_style), Paragraph(username, normal_style)],
        [Paragraph("<b>Report Date:</b>", normal_style), Paragraph(date, normal_style)],
    ]
    
    info_table = Table(info_data, colWidths=[2*inch, 4*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), HexColor('#f0fdf4')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Image section
    if os.path.exists(image_path):
        try:
            elements.append(Paragraph("Analyzed Image", heading_style))
            img = Image(image_path, width=3*inch, height=3*inch)
            elements.append(img)
            elements.append(Spacer(1, 0.2*inch))
        except Exception as e:
            elements.append(Paragraph(f"<i>Image could not be displayed: {str(e)}</i>", normal_style))
            elements.append(Spacer(1, 0.2*inch))
    
    # Prediction Results
    elements.append(Paragraph("Prediction Results", heading_style))
    
    prediction_data = [
        [Paragraph("<b>Detected Disease:</b>", normal_style), Paragraph(predicted_class_display, normal_style)],
        [Paragraph("<b>Confidence Score:</b>", normal_style), Paragraph(f"{confidence*100:.2f}%", normal_style)],
    ]
    
    pred_table = Table(prediction_data, colWidths=[2*inch, 4*inch])
    pred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), HexColor('#d1fae5')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(pred_table)
    elements.append(Spacer(1, 0.2*inch))
    
    # Treatment Recommendations
    elements.append(Paragraph("Treatment Recommendations", heading_style))
    
    treatment_data = [
        [Paragraph("<b>Recommended Treatment:</b>", normal_style), Paragraph(treatment, normal_style)],
        [Paragraph("<b>Suggested Medicine:</b>", normal_style), Paragraph(medicine, normal_style)],
    ]
    
    treatment_table = Table(treatment_data, colWidths=[2*inch, 4*inch])
    treatment_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), HexColor('#fef3c7')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(treatment_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_text = "This report was automatically generated by AgroGuard AI. Please consult with agricultural experts for additional guidance."
    elements.append(Paragraph(f"<i>{footer_text}</i>", styles['Normal']))
    
    # Build PDF
    doc.build(elements)
    
    return filename, filepath


def get_reports_directory() -> str:
    """Get the reports directory path"""
    return REPORTS_DIR
