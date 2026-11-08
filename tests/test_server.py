"""Comprovacions de ports amb dobles; no requereixen obrir sockets."""
import errno
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch, Mock
spec = importlib.util.spec_from_file_location('bord_server', Path(__file__).resolve().parents[1] / 'serve.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PortsTest(unittest.TestCase):
    def test_free_port(self):
        server = Mock(server_address=('127.0.0.1', 8082))
        with patch.object(module, 'ThreadingHTTPServer', return_value=server):
            self.assertEqual(module.get_server(8082, module.ROOT), (server, 8082))

    def test_existing_instance(self):
        with patch.object(module, 'ThreadingHTTPServer', side_effect=OSError(errno.EADDRINUSE, 'occupied')), patch.object(module, 'is_our_instance', return_value=True):
            self.assertEqual(module.get_server(8082, module.ROOT), (None, 8082))

    def test_other_application_uses_next_port(self):
        server = Mock(server_address=('127.0.0.1', 8083))
        with patch.object(module, 'ThreadingHTTPServer', side_effect=[OSError(errno.EADDRINUSE, 'occupied'), server]) as factory, patch.object(module, 'is_our_instance', return_value=False):
            self.assertEqual(module.get_server(8082, module.ROOT), (server, 8083))
            self.assertEqual(factory.call_args.args[0], ('127.0.0.1', 8083))

    def test_reuses_alternative_instance(self):
        with patch.object(module, 'ThreadingHTTPServer', side_effect=OSError(errno.EADDRINUSE, 'occupied')), patch.object(module, 'is_our_instance', side_effect=[False, True]):
            self.assertEqual(module.get_server(8082, module.ROOT), (None, 8083))

    def test_permission_error_is_not_a_port_conflict(self):
        with patch.object(module, 'ThreadingHTTPServer', side_effect=PermissionError(errno.EPERM, 'denied')), patch.object(module, 'is_our_instance') as probe:
            with self.assertRaises(PermissionError):
                module.get_server(8082, module.ROOT)
            probe.assert_not_called()

    def test_project_identity(self):
        self.assertNotEqual(module.identity('/tmp/one'), module.identity('/tmp/two'))


if __name__ == '__main__':
    unittest.main()
