import { Component } from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import { Button } from './buttons';
import { MdOutlineClear, MdDownload } from 'react-icons/md';
import { CVForm } from './CVForm';
import CVDocument from './CVDocument';
import { pdf } from '@react-pdf/renderer';

export default class Main extends Component {
  constructor(props) {
    super(props);

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    this.state = {
      firstName: null,
      lastName: null,
      pdf: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(formData) {
    const blob = await pdf(<CVDocument values={formData} />).toBlob();
    const base64 = await new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    this.setState({ pdf: base64 });
    this.setState({
      firstName: formData.general.firstName,
      lastName: formData.general.lastName,
    });
  }

  render() {
    return (
      <main>
        {this.state.pdf && (
          <div className="modal" id="modal">
            <div className="modal-backgroud"></div>
            <div className="modal-card">
              <div className="modal-card-body">
                <Document file={this.state.pdf}>
                  <Page pageNumber={1} />
                </Document>
              </div>
              <div className="modal-card-footer">
                <Button
                  data={{ icon: <MdOutlineClear />, label: 'Close' }}
                  onClick={() => this.setState({ pdf: null })}
                />
                <a
                  className="btn btn--primary"
                  href={this.state.pdf}
                  download={`${this.state.lastName}-${this.state.firstName}.pdf`}>
                  <span className="icon">
                    <MdDownload />
                  </span>
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          </div>
        )}
        <CVForm onSubmit={this.handleSubmit} />
      </main>
    );
  }
}
