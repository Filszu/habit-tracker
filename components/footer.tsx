import Link from "next/link"
import { Github, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t mt-12 py-6 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Habits Tracker</p>
          <p className="text-sm text-gray-600">Created with ❤️ by Filshu</p>
          <p className="text-sm text-gray-600 mt-2">
            Support project:{" "}
            <a href="" className="hover:underline">
              aaa
            </a>
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            href="https://www.instagram.com/filip_kyokushin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://github.com/filszu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

