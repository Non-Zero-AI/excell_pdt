import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Excell PDT
              </span>
            </div>
            <p className="text-muted text-sm max-w-md">
              Professional Driver Training platform for commercial and passenger drivers.
              Advance your career with industry-leading certification courses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses"
                  className="text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/certification"
                  className="text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Certification
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-muted text-sm">
            © {currentYear} Excell PDT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

